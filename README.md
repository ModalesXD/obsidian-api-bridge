
# 🧩 Obsidian API Bridge

![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)

A powerful Obsidian plugin that lets you define, test, and execute custom HTTP endpoints directly from your vault. Perfect for automating workflows, connecting to external APIs, and manipulating data from your notes.

✅ Works on both **desktop and mobile** (Obsidian Mobile App)

---

## 🚀 Features

- **Visual Endpoint Management:** Create, edit, delete, and test HTTP endpoints from the plugin settings.
- **Variable & Token Support:** Use dynamic variables and reusable tokens in URLs, headers, and request bodies.
- **Variable Interpolation:** Insert Obsidian or custom variables anywhere in your request.
- **User Input Prompt:** If your endpoint contains `{{input}}`, the plugin will prompt you for a value before execution.
- **Supports All HTTP Methods:** GET, POST, PUT, DELETE, PATCH.
- **Flexible Response Handling:** Choose to display the response in a modal, copy it to the clipboard, or insert it into the active note.
- **Import/Export Endpoints:** Easily backup or share your endpoint configuration as JSON.
- **Execution Logging:** Automatically saves execution logs in the `.api-bridge-logs` folder.
- **Quick Commands:** Run endpoints manually from the command palette or with a ribbon button.

---

## 📦 Installation

1. Download and copy the plugin folder to `.obsidian/plugins/obsidian-api-bridge` inside your vault.
2. Enable the plugin from Obsidian’s **Settings → Community Plugins**.

---

## 🧠 Usage

1. Open the plugin settings (Settings → API Bridge).
2. Add, edit, or delete endpoints as needed.
3. Use the **Test Endpoint** button to try out your configuration before saving.
4. Run endpoints from:
   - The command palette
   - The ribbon icon
   - (Coming soon) Slash commands in notes
5. Check execution logs in the `.api-bridge-logs` folder.

---

## 🧩 Variables & Tokens

- Use `{{input}}` in the URL or body to prompt the user at execution time.
- Use `{{title}}` to insert the active file title.
- Define reusable tokens in the "Tokens" section and reference them with `{{tokenName}}`.

---

## 🔁 Import/Export

- Use the **Import Endpoints JSON** and **Export Endpoints JSON** buttons in the settings to share or backup your configuration.

---

## 🧪 Example Endpoint

```json
{
  "id": "my-endpoint",
  "name": "My API",
  "url": "https://api.example.com/data/{{input}}",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{token}}"
  },
  "bodyTemplate": {
    "query": "{{input}}"
  },
  "insertResponseTo": "modal",
  "trigger": ["manual"],
  "requireConfirmation": false
}
````

---

## 🧭 Roadmap

* [x] Prompt input support (`{{input}}`)
* [x] UI testing of endpoints
* [x] Import/export JSON config
* [x] Execution logging to `.api-bridge-logs`
* [ ] Slash commands or inline triggers in notes
* [ ] Auto-run endpoints on file open/save
* [ ] Quick panel to run endpoints visually

---

## 👤 Author

**ModalesXD**
🔗 [GitHub Profile](https://github.com/ModalesXD)
📦 [Repository](https://github.com/MODALESXD/obsidian-api-bridge)

---

## 📄 License

This project is licensed under the
**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

You are free to:

* ✅ Use, copy, and modify the code
* ✅ Fork and build upon it
* ❌ Not for commercial use

### Requirements:

* You **must credit** the original author:
  **ModalesXD**
  [Original repository](https://github.com/ModalesXD/obsidian-api-bridge)

* If you make changes, you must **indicate** what was modified.

See full license in [`LICENSE`](./LICENSE)
or online: [https://creativecommons.org/licenses/by-nc/4.0/legalcode](https://creativecommons.org/licenses/by-nc/4.0/legalcode)
 