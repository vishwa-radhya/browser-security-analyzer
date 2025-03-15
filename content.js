console.log("Browser Security Analyzer is running on this page!");

// Detect if the site is using HTTPS
if (location.protocol !== "https:") {
  console.warn("Warning: This site is not using HTTPS!");
}
