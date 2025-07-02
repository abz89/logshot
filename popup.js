document.getElementById("screenshot").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "capture" });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "capture" }, () => {
    window.close();
  });
});
