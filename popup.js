document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const vpnStatus = document.getElementById("vpnStatus");
  const loader = document.getElementById("loader");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // ✅ Step 1: Check if token exists
  chrome.storage.local.get(["token", "isEnabled"], (data) => {
    const token = data.token;
    const isEnabled = data.isEnabled;

    if (!token) {
      vpnStatus.textContent = "❌ Please log in via Web to use VPN";
      connectBtn.style.display = "none";
      disconnectBtn.style.display = "none";
      loginBtn.style.display = "inline-block";

      loginBtn.onclick = () => {
        chrome.tabs.create({
          url: "https://my-vpn-server.vercel.app/signup",
        });
      };

      return;
    }

    if (isEnabled) {
      vpnStatus.textContent = "Status: Connected to Singapore";
      connectBtn.style.display = "none";
      disconnectBtn.style.display = "inline-block";
    } else {
      vpnStatus.textContent = "Status: Disconnected";
      connectBtn.style.display = "inline-block";
      disconnectBtn.style.display = "none";
    }
    logoutBtn.style.display = "inline-block";
  });

  // ✅ Step 2: Connect VPN
  connectBtn.onclick = () => {
    loader.style.display = "block";
    chrome.runtime.sendMessage({ toggleProxy: true }, (response) => {
      loader.style.display = "none";
      if (response.status === "ok") {
        vpnStatus.textContent = "Status: Connected to Singapore";
        connectBtn.style.display = "none";
        disconnectBtn.style.display = "inline-block";
      } else {
        vpnStatus.textContent = "❌ Failed: " + response.message;
      }
    });
  };

  // ✅ Step 3: Disconnect VPN
  disconnectBtn.onclick = () => {
    loader.style.display = "block";
    chrome.runtime.sendMessage({ toggleProxy: false }, (response) => {
      loader.style.display = "none";
      vpnStatus.textContent = "Status: Disconnected";
      connectBtn.style.display = "inline-block";
      disconnectBtn.style.display = "none";
    });
  };
});

logoutBtn.onclick = () => {
  chrome.storage.local.remove(["token", "isEnabled"], () => {
    vpnStatus.textContent = "✅ Logged out successfully";
    connectBtn.style.display = "none";
    disconnectBtn.style.display = "none";
    logoutBtn.style.display = "none";
  });
};
