chrome.runtime.onInstalled.addListener(() => {
    console.log("Browser Security Analyzer Installed!");
});
  
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log(`Checking security for: ${tab.url}`);
    }
});
  