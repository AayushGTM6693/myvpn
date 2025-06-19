document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const vpnStatus = document.getElementById("vpnStatus");
  const loader = document.getElementById("loader");

  connectBtn.onclick = () => {
    loader.style.display = "block";
    chrome.runtime.sendMessage({ toggleProxy: true }, (response) => {
      loader.style.display = "none";
      vpnStatus.textContent = "Status: Connected to Singapore";
      connectBtn.style.display = "none";
      disconnectBtn.style.display = "inline-block";
    });
  };

  disconnectBtn.onclick = () => {
    loader.style.display = "block";
    chrome.runtime.sendMessage({ toggleProxy: false }, (response) => {
      loader.style.display = "none";
      vpnStatus.textContent = "Status: Disconnected";
      connectBtn.style.display = "inline-block";
      disconnectBtn.style.display = "none";
    });
  };

  chrome.storage.local.get("isEnabled", (data) => {
    if (data.isEnabled) {
      vpnStatus.textContent = "Status: Connected to Singapore";
      connectBtn.style.display = "none";
      disconnectBtn.style.display = "inline-block";
    } else {
      vpnStatus.textContent = "Status: Disconnected";
    }
  });
});
