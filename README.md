# Browser Security Analyzer

![Browser Security Analyzer](icons/icon128.svg)

## Overview

Browser Security Analyzer is a Chrome extension designed to help users identify potential security risks in their browser environment. It analyzes installed extensions, browser configurations, and browsing habits to provide a comprehensive security assessment and actionable recommendations.

## Features

### 📊 Security Analysis Dashboard
- Real-time analysis of browser security components
- Simple one-click analysis process
- Intuitive visual indicators for security issues

### 🧩 Extension Analysis
- Identifies potentially malicious extensions
- Analyzes extension permissions and risk levels
- Flags high-risk extensions based on permissions and source

### ⚙️ Browser Configuration Check
- Evaluates Safe Browsing settings
- Assesses password manager configurations
- Analyzes cookie settings and policies
- Identifies insecure browser settings

### 🔍 Browsing Habits Monitoring
- Detects visits to insecure (HTTP) websites
- Provides real-time alerts for non-secure connections
- Tracks browsing patterns that may pose security risks

### 📝 Detailed Reporting
- Comprehensive security report with actionable insights
- Visual risk indicators and security ratings
- Horizontal layout for easy information scanning
- Summary statistics to quickly identify areas of concern

### 🚨 Real-time Security Alerts
- Banner notifications when visiting insecure sites
- Non-intrusive warnings with clear security information
- One-click dismissal option for alerts

## Tech Stack & Dependencies

- **JavaScript**: Core extension functionality
- **Chrome Extension API**: 
  - `chrome.management`: For analyzing installed extensions
  - `chrome.privacy`: For checking browser security settings
  - `chrome.tabs`: For tab management and monitoring
  - `chrome.storage`: For storing analysis results
  - `chrome.history`: For analyzing browsing history

## Installation and Setup

### From Chrome Web Store
1. Visit the Chrome Web Store [link coming soon]
2. Click "Add to Chrome"
3. Confirm the installation when prompted

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your browser toolbar

## Usage

1. Click the Browser Security Analyzer icon in your toolbar
2. Click "Run Security Check" to begin analysis
3. View the summary of security findings directly in the popup
4. Click "View Detailed Report" for comprehensive results
5. Address any security issues highlighted in the report

## Permissions

This extension requires the following permissions to function properly:

- `storage`: To save analysis results
- `tabs`: To check current browser tabs
- `activeTab`: To analyze the current active tab
- `scripting`: To inject security warning banners on insecure sites
- `management`: To analyze installed extensions
- `privacy`: To check browser privacy settings
- `cookies`: To analyze cookie settings
- `webNavigation`: To monitor page navigations
- `history`: To analyze browsing history

## Privacy Policy

The Browser Security Analyzer extension:

- Does not collect or transmit any personal data
- Performs all analysis locally within your browser
- Does not share any information with third parties
- Does not use any remote servers or APIs

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

