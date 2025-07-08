document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["fixForArc"], (config) => {
    console.log("fixForArc:", config.fixForArc);

    if (config.fixForArc) {
      // Auto-capture mode (Arc fix)
      chrome.runtime.sendMessage({ action: "capture" }, () => {
        window.close();
      });
    } else {
      // Manual mode (button click)
      document.getElementById("screenshot").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "capture" }, () => {
          window.close();
        });
      });
    }
  });
});
