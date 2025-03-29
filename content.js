console.log("Browser Security Analyzer is running on this page!");

// Detect if the site is using HTTPS
if (location.protocol !== "https:") {
  console.warn("Warning: This site is not using HTTPS!");
}

// Function to check if the site is secure
function checkSiteSecurity() {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Check for HTTP protocol
    if (protocol === 'http:') {
        // Don't show alert for localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return;
        }
        
        // Create and show security alert
        showSecurityAlert();
    }
}

// Function to create and show security alert
function showSecurityAlert() {
    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fce8e6;
        color: #c5221f;
        padding: 12px;
        text-align: center;
        z-index: 999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Create alert content
    const alertContent = document.createElement('div');
    alertContent.style.cssText = `
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    `;

    // Add warning icon
    const warningIcon = document.createElement('span');
    warningIcon.textContent = '⚠️';
    warningIcon.style.fontSize = '20px';

    // Add warning message
    const warningMessage = document.createElement('span');
    warningMessage.textContent = 'This site is not secure. Your data may be at risk.';
    warningMessage.style.fontWeight = '500';

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: #c5221f;
        font-size: 20px;
        cursor: pointer;
        padding: 0 10px;
        margin-left: auto;
    `;

    // Assemble alert
    alertContent.appendChild(warningIcon);
    alertContent.appendChild(warningMessage);
    alertContent.appendChild(closeButton);
    alertContainer.appendChild(alertContent);

    // Add close button functionality
    closeButton.addEventListener('click', () => {
        alertContainer.remove();
    });

    // Add alert to page
    document.body.insertBefore(alertContainer, document.body.firstChild);

    // Adjust body padding to account for alert
    document.body.style.paddingTop = '48px';
}

// Check site security when page loads
checkSiteSecurity();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CHECK_SECURITY') {
        checkSiteSecurity();
    }
});
