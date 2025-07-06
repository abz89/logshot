const CONFIGS = [
  "SLACK_TOKEN",
  "CHANNEL_ID",
  "autosave",
  "notifications",
  "postToSlack",
];

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
  chrome.storage.sync.get(CONFIGS, (config) => {
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
          trimmedTitle =
            "Berpartisipasi pada sesi koordinasi rutin tim Security";
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
              saveAs: !config.autosave,
            },
            () => {
              console.log(`Screenshot saved as ${filename}`);

              if (config.notifications) {
                chrome.notifications.create({
                  type: "basic",
                  iconUrl: "icon.png",
                  title: "📸 Screenshot Saved",
                  message: `${filename}`,
                });
              }
            },
          );

          if (config.postToSlack) {
            uploadScreenshotToSlack(config, dataUrl, filename);
          }
        },
      );
    });
  });
}

async function uploadScreenshotToSlack(config, fileBlob, filename) {
  try {
    const { uploadUrl, fileId } = await getUploadUrl(
      config,
      fileBlob,
      filename,
    );

    await uploadToSlackUploadUrl(uploadUrl, fileBlob, filename);

    await completeUpload(config, fileId, filename);
    console.log("Upload finalized to Slack!");
  } catch (err) {
    console.error("Slack upload failed:", err.message);
  }
}

async function getUploadUrl(config, dataUrl, filename) {
  const fileBlob = await fetch(dataUrl).then((res) => res.blob());

  const length = fileBlob.size;

  const formData = new FormData();
  formData.append("token", config.SLACK_TOKEN);
  formData.append("filename", filename);
  formData.append("length", length);

  const response = await fetch(
    "https://slack.com/api/files.getUploadURLExternal",
    {
      method: "POST",
      contetntType: "application/x-www-form-urlencoded",
      body: formData,
    },
  );

  const json = await response.json();
  if (!json.ok) throw new Error(`Slack upload URL error: ${json.error}`);
  return {
    uploadUrl: json.upload_url,
    fileId: json.file_id,
  };
}

async function uploadToSlackUploadUrl(uploadUrl, fileBlob, filename) {
  const formData = new FormData();
  formData.append("filename", dataURLToBlob(fileBlob), filename);

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload to Slack failed: ${res.status} ${text}`);
  }
}

async function completeUpload(config, fileId, filename) {
  const res = await fetch(
    "https://slack.com/api/files.completeUploadExternal",
    {
      method: "POST",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${config.SLACK_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: [
          {
            id: fileId,
            title: filename,
          },
        ],
        channel_id: config.CHANNEL_ID,
      }),
    },
  );

  const json = await res.json();
  if (!json.ok) throw new Error(`Slack finalize error: ${json.error}`);
}

function dataURLToBlob(dataUrl) {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)[1];
  const binary = atob(parts[1]);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}
