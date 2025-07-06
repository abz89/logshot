document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  chrome.storage.sync.get(
    [
      "SLACK_TOKEN",
      "CHANNEL_ID",
      "autosave",
      "notifications",
      "postToSlack",
      "fixForArc",
    ],
    (data) => {
      $("slackToken").value = data.SLACK_TOKEN || "";
      $("channelId").value = data.CHANNEL_ID || "";
      $("autosave").checked = data.autosave ?? true;
      $("notifications").checked = data.notifications ?? true;
      $("postToSlack").checked = data.postToSlack ?? false;
      $("fixForArc").checked = data.fixForArc ?? false;
    },
  );

  $("save").addEventListener("click", () => {
    chrome.storage.sync.set(
      {
        SLACK_TOKEN: $("slackToken").value.trim(),
        CHANNEL_ID: $("channelId").value.trim(),
        autosave: $("autosave").checked,
        notifications: $("notifications").checked,
        postToSlack: $("postToSlack").checked,
        fixForArc: $("fixForArc").checked,
      },
      () => {
        alert("Settings saved!");
      },
    );
  });

  $("reset").addEventListener("click", () => {
    const defaults = {
      SLACK_TOKEN: "",
      CHANNEL_ID: "",
      autosave: true,
      notifications: true,
      postToSlack: false,
      fixForArc: false,
    };

    chrome.storage.sync.set(defaults, () => {
      document.getElementById("slackToken").value = "";
      document.getElementById("channelId").value = "";
      document.getElementById("autosave").checked = true;
      document.getElementById("notifications").checked = true;
      document.getElementById("postToSlack").checked = false;
      document.getElementById("fixForArc").checked = false;

      alert("Settings have been reset to default.");
    });
  });
});
