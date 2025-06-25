# MyVPN - Chrome Extension (Singapore Proxy)

**MyVPN** is a lightweight Chrome extension that routes your browser traffic through a secure SOCKS5 VPN proxy server hosted in **Singapore**. This allows you to **change your IP**, **bypass geo-restrictions**, and **enhance your privacy**, all within your browser — no system-wide VPN needed.

---

## 🔐 Authentication Required

This extension uses **JWT-based authentication** via our official [Web Platform](https://my-vpn-server.vercel.app). Only **authenticated users** can access the proxy.

- After logging in on the web, your browser receives a secure token.
- This token is securely passed to the extension using `chrome.runtime.sendMessage` (from web → extension).
- The extension uses this token to fetch proxy details from the backend.

---

## 🔧 How It Works (Architecture)

1. **User signs up/logs in** via the WAVE web interface (Next.js frontend).
2. The backend (Node.js + Express + PostgreSQL) generates a JWT.
3. This JWT is sent to the Chrome extension using `chrome.runtime.sendMessage` (requires `externally_connectable` permission).
4. The extension stores the token in `chrome.storage.local`.
5. When the user clicks **Connect**, the extension:
   - Uses the token to request a secure SOCKS5 proxy config from the backend.
   - Applies the proxy config using `chrome.proxy.settings.set`.
6. All browser traffic is routed through the **Dante SOCKS5 proxy** hosted on a **DigitalOcean droplet in Singapore**.

---

## ✅ Features

- 🔐 JWT-authenticated proxy access
- 🇸🇬 Singapore-based SOCKS5 server
- 🧠 Smart connect/disconnect toggle
- 🌐 No system-wide effect — browser-only VPN
- 🔁 Persistent session using `chrome.storage.local`
- 🚫 Blocks usage without login

---

## 📦 Installation (Manual for Now)

Since it's still in early stages, install it manually as follows:

1. Clone or download this repo.
2. Open Chrome and go to: `chrome://extensions/`
3. Enable **"Developer Mode"**.
4. Click **"Load unpacked"** and select the folder containing the extension files (not the `.zip`).

> ⚠️ Do NOT zip the folder inside another folder. Chrome expects direct access to `manifest.json`.

---

## 🚀 Usage Instructions


0. First  **"Load unpacked"** and the icon should appear on the browser. Click ( Click here to signin)
1. **Go to** [https://my-vpn-server.vercel.app](https://my-vpn-server.vercel.app) and create an account.
2. Log in using your email and password.
3. Your browser will send the JWT token to the extension.
4. Open the extension popup:
   - Click **"Connect to Singapore"** to start using the VPN.
   - Click **"Disconnect"** to stop using it.
5. Use the **Logout** button in the popup to securely remove your token.

> 🔁 Status updates are displayed live (e.g., “Connected to Singapore”, “Disconnected”).

---

## 🧪 Development Challenges Faced

### 1. **Token Passing from Web → Extension**

- Chrome requires `externally_connectable` setup in `manifest.json`.
- We used `chrome.runtime.sendMessage` with proper origin and permissions to pass JWT securely.

### 2. **Memory Issues on VPS (Dante OOM)**

- Initial VPS only had **512MB RAM**.
- When traffic spiked, **Dante** was OOM-killed by the kernel.
- Fixed by upgrading to **1GB RAM** and optimizing Dante config.

### 3. **SOCKS5 Authentication Complexity**

- Chrome extensions do NOT allow SOCKS5 username/password prompts.
- Solved by moving authentication to the backend (JWT) and giving tokens access to the proxy if valid.

### 4. **Auto Disconnect on Token Removal**

- Added logic to reset proxy settings if token is missing or removed.
- Prevents stale sessions or proxy leaks.

### 5. **Proxy Leaks**

- Observed browser fallback to real IP if token was removed from inspect tools only.
- Fixed by adding a **Logout** button that:
  - Properly removes token
  - Calls `chrome.proxy.settings.clear()` to disable VPN.

---

## 🔄 Roadmap

- [x] Login/Signup via Vercel frontend
- [x] Secure token flow from web → extension
- [x] SOCKS5 setup on VPS with Dante
- [x] Extension popup UI (Connect/Disconnect/Logout)
- [x] Publish to Chrome Web Store (done ✅)
- [ ] Auto provisioning of SOCKS user for each login (backend)
- [ ] Server-side connection limiting / abuse prevention
- [ ] Multi-region proxy support

---

## 👨‍💻 Built With

- **Next.js** (Frontend for login/signup)
- **Node.js + Express + Prisma** (API backend)
- **PostgreSQL** (user database via Neon)
- **Chrome Extension (Manifest V3)** (UI + proxy logic)
- **Dante SOCKS5 Proxy** (hosted on DigitalOcean VPS)

---

## 🌍 Privacy & Security

- We don’t log user activity or URLs.
- Only your **browser traffic** is proxied.
- JWT tokens are stored in `chrome.storage.local`, not sent anywhere else.

---

## 🔗 Chrome Extension URL

Once approved:  
👉 `https://chrome.google.com/webstore/detail/*****`

Until then, install it using **"Load Unpacked"** from above.

---

## 🧠 Final Notes

This extension started as a personal learning project — combining backend, full-stack auth, Chrome extensions, and VPN technologies.

**My goal** was to build something practical, secure, and educational — and to share it freely.

Thanks for checking it out. 💚  
— _Aayush_
