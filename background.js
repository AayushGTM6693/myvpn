let isEnabled = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: false });
});

async function fetchVpnConfig() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("token", async (data) => {
      if (!data.token) {
        reject("No token found");
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/vpn-access", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (!res.ok) {
          reject("Unauthorized or failed to fetch config");
          return;
        }

        const config = await res.json();
        resolve(config.socks5);
      } catch (error) {
        reject("Network error");
      }
    });
  });
}

function setProxy(enabled, proxyConfig = null) {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

    return true; // Required for async sendResponse
  }
});
