document.addEventListener('DOMContentLoaded', () => {
    const checkSecurityBtn = document.getElementById('checkSecurity');
    const statusElement = document.getElementById('status');
    const viewReportBtn = document.getElementById('view-detailed-report');
    const loaderDiv = document.querySelector('.loader-div');
    const quickStatsDiv = document.getElementById('quickStats');

    // Show/hide loader
    function toggleLoader(show) {
        loaderDiv.style.display = show ? 'block' : 'none';
        checkSecurityBtn.disabled = show;
    }

    // Update quick stats
    function updateQuickStats(results) {
        const highRiskExtensions = results.extensions.filter(ext => ext.riskLevel === 'high').length;
        const configWarnings = results.browserConfig.warnings.length;
        const habitsWarnings = results.browsingHabits.warnings.length;

        quickStatsDiv.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${highRiskExtensions}</div>
                <div class="stat-label">High Risk Extensions</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${configWarnings}</div>
                <div class="stat-label">Config Issues</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${habitsWarnings}</div>
                <div class="stat-label">Browsing Risks</div>
            </div>
        `;
    }

    // Update status message
    function updateStatus(results) {
        const totalWarnings = 
            results.extensions.filter(ext => ext.warnings.length > 0).length +
            results.browserConfig.warnings.length +
            results.browsingHabits.warnings.length;

        if (totalWarnings === 0) {
            statusElement.textContent = '✅ Your browser security is in good shape!';
            statusElement.className = 'status success';
        } else if (totalWarnings < 3) {
            statusElement.textContent = '⚠️ Minor security issues detected';
            statusElement.className = 'status warning';
        } else {
            statusElement.textContent = '❌ Multiple security issues found';
            statusElement.className = 'status error';
        }

        updateQuickStats(results);
    }

    // Handle security check
    checkSecurityBtn.addEventListener('click', async () => {
        toggleLoader(true);
        statusElement.textContent = 'Analyzing security...';
        statusElement.className = 'status';
        quickStatsDiv.innerHTML = '';
        
        try {
            const response = await chrome.runtime.sendMessage({ type: 'START_ANALYSIS' });
            
            if (response.success) {
                updateStatus(response.results);
                // Store results for detailed report
                chrome.storage.local.set({ securityResults: response.results });
            } else {
                statusElement.textContent = '❌ Analysis failed. Please try again.';
                statusElement.className = 'status error';
            }
        } catch (error) {
            statusElement.textContent = '❌ Analysis failed. Please try again.';
            statusElement.className = 'status error';
        } finally {
            toggleLoader(false);
        }
    });

    // Handle detailed report view
    viewReportBtn.addEventListener('click', () => {
        chrome.storage.local.get(['securityResults'], (data) => {
            if (data.securityResults) {
                // Open report in new tab
                chrome.tabs.create({
                    url: 'report.html'
                });
            }
        });
    });

    // Check if we have existing results
    chrome.storage.local.get(['securityResults'], (data) => {
        if (data.securityResults) {
            updateStatus(data.securityResults);
        }
    });
});