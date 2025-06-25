let isEnabled = false;

// Set default VPN state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: false });
});

// Function to fetch VPN proxy config from backend
async function fetchVpnConfig() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("token", async (data) => {
      if (!data.token) {
        reject("No token found");
        return;
      }

      try {
        const res = await fetch(
          "https://my-vpn-server-z5f0.onrender.com/api/vpn-access",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (!res.ok) {
          reject("Unauthorized or failed to fetch config");
          return;
        }

        const config = await res.json();
        resolve(config.socks5); // only pass SOCKS5 proxy part
      } catch (error) {
        reject("Network error");
      }
    });
  });
}

// Function to enable or disable proxy
function setProxy(enabled, proxyConfig = null) {
  console.log("⚙️ Setting proxy:", enabled, proxyConfig);
  if (enabled && proxyConfig) {
    chrome.proxy.settings.set(
      {
        value: {
          mode: "fixed_servers",
          rules: {
            singleProxy: {
              scheme: "socks5",
              host: proxyConfig.host,
              port: parseInt(proxyConfig.port),
            },
            bypassList: ["<local>"],
          },
        },
        scope: "regular",
      },
      () => {}
    );
  } else {
    chrome.proxy.settings.clear({ scope: "regular" });
  }
}

////////////////////////////////////////////////////////////
// 🟢 INTERNAL EXTENSION MESSAGES (popup.js etc)
////////////////////////////////////////////////////////////

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("🔁 Internal message received:", request);

  if (request.toggleProxy !== undefined) {
    if (request.toggleProxy) {
      fetchVpnConfig()
        .then((config) => {
          isEnabled = true;
          setProxy(true, config);
          chrome.storage.local.set({ isEnabled });
          sendResponse({ status: "ok" });
        })
        .catch((err) => {
          console.error("VPN Config Fetch Error:", err);
          sendResponse({ status: "error", message: err });
        });
    } else {
      isEnabled = false;
      setProxy(false);
      chrome.storage.local.set({ isEnabled });
      sendResponse({ status: "ok" });
    }
    return true; // Important for async response
  }
});

////////////////////////////////////////////////////////////
// 🌐 EXTERNAL MESSAGES (web UI from Vercel, localhost etc)
////////////////////////////////////////////////////////////

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log("🌐 External message received:", request);

    if (request.setToken) {
      chrome.storage.local.set({ token: request.setToken }, () => {
        console.log("✅ Token stored from external web");
        sendResponse({ status: "ok" });
      });
      return true;
    }
  }
);
