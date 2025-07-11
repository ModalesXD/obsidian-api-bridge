import { PluginSettingTab, App, Setting, Modal, Notice } from "obsidian";
import { type PluginSettings, type ApiEndpoint, InsertAction, TriggerType } from "./types";
import type APIBridgePlugin from "./main";
import { EndpointEditorModal } from "./endpointEditor";

export const DEFAULT_SETTINGS: PluginSettings = {
	endpoints: [],
	tokens: {},
};

export class APIBridgeSettingTab extends PluginSettingTab {
	plugin: APIBridgePlugin;

	constructor(app: App, plugin: APIBridgePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", {
			text: "API Bridge – Endpoint Settings",
		});

		new Setting(containerEl)
			.setName("Configured endpoints")
			.setDesc(
				"You currently have " +
					this.plugin.settings.endpoints.length +
					" endpoint(s)."
			)
			.addButton((btn) => {
				btn.setButtonText("View/Edit")
					.setCta()
					.onClick(() => {
						this.showEndpointList(containerEl);
					});
			});

		// Token management section
		containerEl.createEl("h3", { text: "Tokens" });
		containerEl.createEl("div", { text: "Tokens can be referenced in endpoints as {{tokenName}}." });

		Object.entries(this.plugin.settings.tokens).forEach(([key, value]) => {
			new Setting(containerEl)
				.setName(key)
				.addText((text) =>
					text.setValue(value).onChange(async (val) => {
						this.plugin.settings.tokens[key] = val;
						await this.plugin.saveSettings();
					})
				)
				.addExtraButton((btn) => {
					btn.setIcon("trash").setTooltip("Delete token").onClick(async () => {
						delete this.plugin.settings.tokens[key];
						await this.plugin.saveSettings();
						this.display();
					});
				});
		});

		new Setting(containerEl)
			.setName("Add new token")
			.addText((text) => {
				text.inputEl.placeholder = "Token name";
			})
			.addText((text) => {
				text.inputEl.placeholder = "Token value";
			})
			.addButton((btn) => {
				btn.setButtonText("Add").onClick(async () => {
					const nameInput = containerEl.querySelectorAll('input[placeholder="Token name"]');
					const valueInput = containerEl.querySelectorAll('input[placeholder="Token value"]');
					const name = (nameInput[nameInput.length-1] as HTMLInputElement)?.value.trim();
					const value = (valueInput[valueInput.length-1] as HTMLInputElement)?.value;
					if (name) {
						this.plugin.settings.tokens[name] = value;
						await this.plugin.saveSettings();
						this.display();
					}
				});
			});

		new Setting(containerEl).addButton((btn) => {
			btn.setButtonText("Import Endpoints JSON").onClick(() => {
				new ImportModal(this.app, this.plugin).open();
			});
		});

		new Setting(containerEl).addButton((btn) => {
			btn.setButtonText("Export Endpoints JSON").onClick(() => {
				const json = JSON.stringify(
					this.plugin.settings.endpoints,
					null,
					2
				);
				navigator.clipboard.writeText(json);
				new Notice("Endpoints copied to clipboard");
			});
		});
	}

	showEndpointList(containerEl: HTMLElement) {
		containerEl.empty();

		this.plugin.settings.endpoints.forEach((endpoint, index) => {
			new Setting(containerEl)
				.setName(endpoint.name)
				.setDesc(endpoint.url)
				.addButton((btn) => {
					btn.setButtonText("Edit").onClick(() => {
						new EndpointEditorModal(
							this.app,
							endpoint,
							(updated) => {
								this.plugin.settings.endpoints[index] = updated;
								this.plugin.saveSettings();
								this.display();
							}
						).open();
					});
				})
				.addExtraButton((btn) => {
					btn.setIcon("trash")
						.setTooltip("Delete")
						.onClick(() => {
							this.plugin.settings.endpoints.splice(index, 1);
							this.plugin.saveSettings();
							this.display();
						});
				});
		});

		new Setting(containerEl).addButton((btn) => {
			btn.setButtonText("➕ New Endpoint")
				.setCta()
				.onClick(() => {
					const nuevo: ApiEndpoint = {
						id: "",
						name: "",
						url: "",
						method: "POST",
						headers: {},
						bodyTemplate: {},
						insertResponseTo: InsertAction.Modal,
						trigger: [TriggerType.Manual],
						requireConfirmation: false,
					};
					new EndpointEditorModal(this.app, nuevo, (created) => {
						this.plugin.settings.endpoints.push(created);
						this.plugin.saveSettings();
						this.display();
					}).open();
				});
		});
	}
}

class ImportModal extends Modal {
	plugin: APIBridgePlugin;
	textarea: HTMLTextAreaElement;

	constructor(app: App, plugin: APIBridgePlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h3", {
			text: "Paste endpoints JSON to import",
		});
		this.textarea = contentEl.createEl("textarea");
		this.textarea.style.width = "100%";
		this.textarea.style.height = "200px";

		new Setting(contentEl).addButton((btn) => {
			btn.setButtonText("Import")
				.setCta()
				.onClick(() => {
					try {
						const data = JSON.parse(this.textarea.value);
						if (Array.isArray(data)) {
							this.plugin.settings.endpoints = data;
							this.plugin.saveSettings();
							new Notice("Import successful");
							this.close();
						} else {
							new Notice("JSON is not an array");
						}
					} catch {
						new Notice("Invalid JSON");
					}
				});
		});

		new Setting(contentEl).addButton((btn) => {
			btn.setButtonText("Cancel").onClick(() => this.close());
		});
	}
}
