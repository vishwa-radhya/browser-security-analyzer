// document.addEventListener("DOMContentLoaded", () => {
//     chrome.storage.local.get("securityReport", (data) => {
//       if (data.securityReport) {
//         document.getElementById("report").innerHTML = data.securityReport;
//       } else {
//         document.getElementById("report").innerHTML = "<p>No security data available.</p>";
//       }
//     });
//   });
  
document.addEventListener('DOMContentLoaded', () => {
    // Get security results from storage
    chrome.storage.local.get(['securityResults'], (data) => {
        if (data.securityResults) {
            displayResults(data.securityResults);
            setupResolutionButtons();
        } else {
            document.body.innerHTML = '<div class="report-container"><div class="header"><h1>No Security Analysis Results Found</h1><p>Please run a security analysis first</p></div></div>';
        }
    });
});

function displayResults(results) {
    // Display summary statistics
    displaySummaryStats(results);

    // Display extensions
    const extensionsList = document.getElementById('extensions-list');
    results.extensions.forEach(ext => {
        const extElement = document.createElement('div');
        extElement.className = `extension-item ${ext.riskLevel}-risk`;
        
        let html = `
            <h3>${ext.name}</h3>
            <p>Version: ${ext.version}</p>
            <p>Status: ${ext.isEnabled ? 'Enabled' : 'Disabled'}</p>
            <span class="risk-level ${ext.riskLevel}-risk-level">
                ${ext.riskLevel === 'high' ? 'High Risk' : 'Low Risk'}
            </span>
        `;

        if (ext.warnings.length > 0) {
            html += '<div class="warnings">';
            ext.warnings.forEach(warning => {
                html += `<p class="warning">${warning}</p>`;
            });
            html += '</div>';
        } else {
            html += '<p class="success">No security issues found</p>';
        }

        extElement.innerHTML = html;
        extensionsList.appendChild(extElement);
    });

    // Display browser configuration
    const browserConfig = document.getElementById('browser-config');
    const config = results.browserConfig;
    
    let configHtml = '<div class="status-card">';
    if (config.warnings.length > 0) {
        config.warnings.forEach(warning => {
            configHtml += `<p class="warning">${warning}</p>`;
        });
    } else {
        configHtml += '<p class="success">Browser configuration is secure</p>';
    }
    configHtml += '</div>';
    
    browserConfig.innerHTML = configHtml;

    // Display browsing habits
    const browsingHabits = document.getElementById('browsing-habits');
    const habits = results.browsingHabits;
    
    let habitsHtml = '<div class="status-card">';
    if (habits.warnings.length > 0) {
        habits.warnings.forEach(warning => {
            habitsHtml += `<p class="warning">${warning}</p>`;
        });
    } else {
        habitsHtml += '<p class="success">No security concerns in browsing habits</p>';
    }
    habitsHtml += '</div>';
    
    browsingHabits.innerHTML = habitsHtml;

    // Display resolution steps
    displayResolutionSteps(results);
}

function displaySummaryStats(results) {
    const summaryStats = document.getElementById('summaryStats');
    
    // Calculate statistics
    const highRiskExtensions = results.extensions.filter(ext => ext.riskLevel === 'high').length;
    const totalExtensions = results.extensions.length;
    const configIssues = results.browserConfig.warnings.length;
    const browsingIssues = results.browsingHabits.warnings.length;
    const totalIssues = highRiskExtensions + configIssues + browsingIssues;
    
    // Create summary stats HTML
    const statsHtml = `
        <div class="stat-item">
            <div class="stat-value">${totalExtensions}</div>
            <div class="stat-label">Total Extensions</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${highRiskExtensions}</div>
            <div class="stat-label">High Risk Extensions</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${totalIssues}</div>
            <div class="stat-label">Total Security Issues</div>
        </div>
    `;
    
    summaryStats.innerHTML = statsHtml;
}

function displayResolutionSteps(results) {
    // Extension resolution steps
    const extensionSteps = document.getElementById('extension-steps');
    const highRiskExtensions = results.extensions.filter(ext => ext.riskLevel === 'high');
    
    if (highRiskExtensions.length > 0) {
        let stepsHtml = '';
        
        // Add steps for each high-risk extension
        highRiskExtensions.forEach(ext => {
            stepsHtml += `<li class="resolution-step">Review and consider removing "${ext.name}" which has high-risk permissions</li>`;
        });
        
        // Add general extension security steps
        stepsHtml += `
            <li class="resolution-step">Visit chrome://extensions to manage your extensions</li>
            <li class="resolution-step">Disable extensions you don't recognize or use</li>
            <li class="resolution-step">Only install extensions from the Chrome Web Store</li>
        `;
        
        extensionSteps.innerHTML = stepsHtml;
    } else {
        extensionSteps.innerHTML = '<li class="resolution-step">No extension issues to resolve</li>';
    }
    
    // Browser configuration resolution steps
    const configSteps = document.getElementById('config-steps');
    const configWarnings = results.browserConfig.warnings;
    
    if (configWarnings.length > 0) {
        let stepsHtml = '';
        
        // Add steps for each configuration warning
        configWarnings.forEach(warning => {
            if (warning.includes('Safe Browsing')) {
                stepsHtml += `<li class="resolution-step">Enable Safe Browsing in Chrome settings</li>`;
            } else if (warning.includes('Password saving')) {
                stepsHtml += `<li class="resolution-step">Enable password saving in Chrome settings</li>`;
            } else if (warning.includes('Third-party cookies')) {
                stepsHtml += `<li class="resolution-step">Block third-party cookies in Chrome settings</li>`;
            } else {
                stepsHtml += `<li class="resolution-step">${warning.replace('is disabled', 'should be enabled')}</li>`;
            }
        });
        
        // Add general browser security steps
        stepsHtml += `
            <li class="resolution-step">Visit chrome://settings/security to manage security settings</li>
            <li class="resolution-step">Keep Chrome updated to the latest version</li>
        `;
        
        configSteps.innerHTML = stepsHtml;
    } else {
        configSteps.innerHTML = '<li class="resolution-step">No configuration issues to resolve</li>';
    }
    
    // Browsing habits resolution steps
    const habitsSteps = document.getElementById('habits-steps');
    const habitsWarnings = results.browsingHabits.warnings;
    
    if (habitsWarnings.length > 0) {
        let stepsHtml = '';
        
        // Add steps for browsing habits
        stepsHtml += `
            <li class="resolution-step">Avoid visiting HTTP sites - look for HTTPS in the address bar</li>
            <li class="resolution-step">Clear browsing history regularly</li>
            <li class="resolution-step">Use incognito mode for sensitive browsing</li>
            <li class="resolution-step">Be cautious with downloads from unknown sources</li>
            <li class="resolution-step">Use strong, unique passwords for each website</li>
        `;
        
        habitsSteps.innerHTML = stepsHtml;
    } else {
        habitsSteps.innerHTML = '<li class="resolution-step">No browsing habit issues to resolve</li>';
    }
}

function setupResolutionButtons() {
    // Extension fix button
    document.getElementById('fix-extensions').addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions' });
    });
    
    // Configuration fix button
    document.getElementById('fix-config').addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://settings/security' });
    });
    
    // Browsing habits fix button
    document.getElementById('fix-habits').addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://settings/clearBrowserData' });
    });
}
  