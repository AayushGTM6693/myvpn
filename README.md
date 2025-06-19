## Authentication Required

To use this extension, you must have a valid SOCKS5 username and password.

If you're just testing, ask the developer to provide temporary login credentials.

## About the SOCKS Proxy

This extension routes your browser traffic through a SOCKS5 proxy server. The proxy server details (host and port) are configured in the extension's background script. Authentication is required to access the proxy.

**Note:** Chrome extensions do not natively support entering SOCKS5 authentication credentials via the extension UI. You may be prompted by Chrome to enter your username and password when connecting, or you may need to configure credentials at the system or browser level.

## Installation

1. Download or clone this repository to your computer.
2. Open Chrome and go to `chrome://extensions`.
3. Enable "Developer mode" (toggle in the top right).
4. Click "Load unpacked" and select the folder containing these files.

## Usage

- Click the extension icon in your browser.
- Click "Connect to Singapore" to enable the VPN proxy.
- Click "Disconnect" to disable the VPN proxy.
- When connecting, enter your SOCKS5 username and password if prompted.

If you encounter issues with authentication, ensure your credentials are correct and that the proxy server is reachable.
