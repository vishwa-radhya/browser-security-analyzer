// Security analysis results storage
let securityResults = {
    extensions: [],
    browserConfig: {},
    browsingHabits: {}
};

// Track visited insecure sites
let insecureSites = new Set();

// Analyze installed extensions
async function analyzeExtensions() {
    const extensions = await chrome.management.getAll();
    const results = extensions.map(ext => ({
        name: ext.name,
        id: ext.id,
        version: ext.version,
        permissions: ext.permissions,
        isEnabled: ext.enabled,
        riskLevel: 'low', // Default risk level
        warnings: []
    }));

    // Check for potentially dangerous permissions
    const dangerousPermissions = [
        'tabs',
        'webNavigation',
        'webRequest',
        'webRequestBlocking',
        'downloads',
        'cookies',
        'storage'
    ];

    results.forEach(ext => {
        // Check for dangerous permissions
        ext.permissions.forEach(permission => {
            if (dangerousPermissions.includes(permission)) {
                ext.warnings.push(`Extension has ${permission} permission which could be used maliciously`);
                ext.riskLevel = 'high';
            }
        });

        // Check if extension is from Chrome Web Store
        if (!ext.id.startsWith('chrome-extension://')) {
            ext.warnings.push('Extension is not from Chrome Web Store');
            ext.riskLevel = 'high';
        }
    });

    return results;
}

// Analyze browser configuration
async function analyzeBrowserConfig() {
    const config = {
        safeBrowsing: await chrome.privacy.services.safeBrowsingEnabled.get({}),
        passwordManager: await chrome.privacy.services.passwordSavingEnabled.get({}),
        thirdPartyCookies: await chrome.privacy.websites.thirdPartyCookiesAllowed.get({}),
        warnings: []
    };

    if (!config.safeBrowsing.value) {
        config.warnings.push('Safe Browsing is disabled');
    }
    if (!config.passwordManager.value) {
        config.warnings.push('Password saving is disabled');
    }
    if (config.thirdPartyCookies.value) {
        config.warnings.push('Third-party cookies are allowed');
    }

    return config;
}

// Analyze browsing habits
async function analyzeBrowsingHabits() {
    const habits = {
        visitedSites: [],
        warnings: []
    };

    // Get recent history
    const history = await chrome.history.search({
        text: '',
        maxResults: 100,
        startTime: Date.now() - (30 * 24 * 60 * 60 * 1000) // Last 30 days
    });

    // Check for HTTP sites
    history.forEach(item => {
        if (item.url.startsWith('http://')) {
            habits.warnings.push(`Insecure HTTP site visited: ${item.url}`);
            insecureSites.add(item.url);
        }
    });

    return habits;
}

// Main security analysis function
async function runSecurityAnalysis() {
    try {
        securityResults.extensions = await analyzeExtensions();
        securityResults.browserConfig = await analyzeBrowserConfig();
        securityResults.browsingHabits = await analyzeBrowsingHabits();

        // Store results
        await chrome.storage.local.set({ securityResults });

        // Notify popup
        chrome.runtime.sendMessage({
            type: 'SECURITY_ANALYSIS_COMPLETE',
            results: securityResults
        });

        return securityResults;
    } catch (error) {
        console.error('Security analysis failed:', error);
        throw error;
    }
}

// Monitor tab updates for security
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if the site is insecure
        if (tab.url.startsWith('http://')) {
            // Add to insecure sites list
            insecureSites.add(tab.url);
            
            // Notify content script to show alert
            chrome.tabs.sendMessage(tabId, { type: 'CHECK_SECURITY' }).catch(() => {
                // Ignore errors for chrome:// or other restricted pages
            });
        }
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_ANALYSIS') {
        runSecurityAnalysis()
            .then(results => sendResponse({ success: true, results }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    }
});

// Initial setup
chrome.runtime.onInstalled.addListener(() => {
    console.log("Browser Security Analyzer Installed!");
});
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log(`Checking security for: ${tab.url}`);
    }
});
  