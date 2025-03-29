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
        } else {
            document.body.innerHTML = '<div class="report-container"><div class="header"><h1>No Security Analysis Results Found</h1><p>Please run a security analysis first</p></div></div>';
        }
    });
});

function displayResults(results) {
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
}
  