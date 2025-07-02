chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "capture") {
    captureScreenshot(sendResponse);
    return true;
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "capture-screenshot") {
    captureScreenshot();
  }
});

async function captureScreenshot(sendResponse = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // const title = tab.title.replace(/[\\/:*?"<>|]/g, "");
    const { title } = tab;

    let trimmedTitle;

    trimmedTitle = title.replace(/^Meet - /gi, "");
    trimmedTitle = trimmedTitle.split("(!")[0].trim();
    trimmedTitle = trimmedTitle.replace(/:/g, "");
    trimmedTitle = trimmedTitle.replace(/#/g, "");
    trimmedTitle = trimmedTitle.replace(/\(/g, "");
    trimmedTitle = trimmedTitle.replace(/\)/g, "");
    trimmedTitle = trimmedTitle.replace(/\//g, "");
    trimmedTitle = trimmedTitle.replace(/\"/g, "");
    trimmedTitle = trimmedTitle.replace(/\|/g, "");

    switch (trimmedTitle) {
      case "Infra CloudOps Stand-up":
        trimmedTitle =
          "Berpartisipasi dalam rapat harian dengan tim Cloud Ops & Security";
        break;
      case "Security Weekly":
        trimmedTitle = "Berpartisipasi pada sesi koordinasi rutin tim Security";
        break;
      case "Infra Weekly Sync":
      case "Infra Weekly Sync New":
        trimmedTitle =
          "Berpartisipasi pada rapat rutin perencanaan pekerjaan pekanan bersama tim Cloud Ops & Security";
        break;
      case "Bahas OKR":
        trimmedTitle =
          "Berpartisipasi pada sesi koordinasi pengelolaan tim Cloud Ops & Security";
        break;
      case "Epic & task planning for next month":
        trimmedTitle =
          "Rapat perencanaan epic dan task tim Cloud Ops & Security untuk bulan berikutnya";
        break;
      case "Cloud Ops Retro":
        trimmedTitle =
          "Berpartisipasi dalam rapat retrospektif bulanan tim Cloud Ops & Security";
        break;
    }

    // const filename = `${month}-${day} - ${title}.png`;
    const filename = `${month}-${day} - ${trimmedTitle}.png`;

    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Capture error:", chrome.runtime.lastError.message);
          return;
        }

        if (sendResponse) {
          sendResponse({ success: true, filename: filename });
        }

        chrome.downloads.download(
          {
            url: dataUrl,
            filename,
            saveAs: false,
          },
          () => {
            chrome.notifications.create({
              type: "basic",
              iconUrl: "icon.png",
              title: "📸 Screenshot Saved",
              message: `${filename}`,
            });
          },
        );
      },
    );
  });
}
