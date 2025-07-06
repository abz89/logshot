# 📸 LogShot

**LogShot** is a lightweight and minimal Chrome extension that lets you take a screenshot of your current browser tab using a keyboard shortcut. The screenshot is automatically saved as a `.png` file with the format: MM-DD - Tab Title.png

---

## ✨ Features

- ✅ One-click (or one-key) screenshot of the active tab
- ✅ Automatically saves to your **Downloads** folder (toggle is configurable)
- ✅ Clean filename: date + current tab title
- ✅ Native notification upon successful save (toggle is configurable)
- ✅ Post an image to Slack channel (Bot Token & Channel is configurable)
- ✅ Works on both **Chrome** and **Arc Browser** (with workaround, toggle is configurable)

---

## 🛠 Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode** (top-right corner)
4. Click **“Load unpacked”**
5. Select the folder you just downloaded/cloned
6. (Optional) Set your preferred shortcut via:  
   `chrome://extensions/shortcuts`

---

## ⌨️ Usage

### 🔹 Option A — Use the keyboard shortcut

- Press `Ctrl+Shift+R` (or your custom shortcut)
- The extension will automatically:
  - Capture the visible area of the current tab
  - Save the screenshot to the **Downloads** folder
  - Show a notification with the file name
  - Post an image to Slack channel

### 🔹 Option B — Click the extension icon

- Click the 📸 icon in the browser toolbar
- The screenshot will be captured and saved immediately

---

## 🔔 Notifications

After the screenshot is captured and saved, a notification will appear showing:

- The file name
- Confirmation that it's saved to your **Downloads** folder

---

## ⚠️ Notes

- Chrome does **not allow setting a default shortcut** to activate the extension popup.  
  You must manually assign a shortcut via `chrome://extensions/shortcuts`.

- In **Arc Browser**, keyboard shortcuts can only be used to activate the extension (i.e., open popup).  
  This extension has a workaround to support that behavior via auto-close pop-up.

---

## 📌 Planned Improvements

- [ ] Full-page screenshot support
- [ ] Option to choose image format (PNG/JPEG)
- [ ] Option to custom tab title - filename mapping
- [ ] Auto-upload to cloud services (Drive, Dropbox, etc.)
- [ ] History panel for saved screenshots

---

## 🤝 Contributing

Pull requests and issues are welcome! Feel free to submit bug reports or feature suggestions.

---

## 📄 License

MIT License © 2025 — [Latuconsina Abz](https://github.com/abz89)
