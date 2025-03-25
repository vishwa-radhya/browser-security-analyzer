const loader = document.getElementById("loader");
document.getElementById("checkSecurity").addEventListener("click", () => {
    loader.style.display='flex'
});

document.getElementById("view-detailed-report").addEventListener("click", () => {
    chrome.tabs.create({ url: "report.html" });
});