let isEnabled = false; // Current proxy status

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: false }); // Set initial state OFF
});

function setProxy(enabled) {
  if (enabled) {
    chrome.proxy.settings.set(
      {
        value: {
          mode: "fixed_servers",
          rules: {
            singleProxy: {
              scheme: "socks5",
              host: " 165.22.110.253",
              port: 1080, //  SOCKS port
            },
            bypassList: ["<local>"], // Local addresses won’t go through proxy
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
    isEnabled = request.toggleProxy;
    setProxy(isEnabled);
    chrome.storage.local.set({ isEnabled });
    sendResponse({ status: "ok" });
  }
});
