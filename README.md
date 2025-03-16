# YouTube Video Tools Extension

A Chrome extension that adds a tools panel above the right sidebar when watching YouTube videos.

## Features

- Adds a tools panel specifically on YouTube video watch pages
- Provides two action buttons: "Create Hook" and "Create Short Script"
- Panel appears above the YouTube right sidebar
- Uses Manifest V3 for Chrome extensions

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top-right corner
3. Click "Load unpacked" and select the extension directory
4. The extension should now be installed and active

## Usage

1. Visit any YouTube video page (URL containing '/watch')
2. The extension panel will appear above the right sidebar
3. Click either the "Create Hook" or "Create Short Script" button (currently shows an alert)

## Customization

- Modify `content.js` to change the panel's behavior and button actions
- Update `styles.css` to change the panel and button appearance
- Replace icon files in the `images` directory with your own icons

## Files

- `manifest.json`: Extension configuration (Manifest V3)
- `content.js`: JavaScript that adds the tools panel to YouTube video pages
- `styles.css`: Styling for the panel and buttons
- `images/`: Directory containing extension icons
