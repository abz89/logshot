document.getElementById("screenshot").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "capture" });
});

chrome.storage.sync.get(["fixForArc"], (config) => {
  if (config.fixForArc) {
    document.addEventListener("DOMContentLoaded", () => {
      chrome.runtime.sendMessage({ action: "capture" }, () => {
        window.close();
      });
    });
  }
});
