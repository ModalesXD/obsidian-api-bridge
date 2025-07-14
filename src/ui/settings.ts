import { PluginSettingTab, App, Setting, Modal, Notice } from "obsidian";
import { type PluginSettings, type ApiEndpoint, InsertAction, TriggerType, HttpMethod } from "../types";
import type APIBridgePlugin from "../main";
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

		const endpointService = this.plugin.getEndpointService();
		const endpoints = endpointService.getAllEndpoints();

		new Setting(containerEl)
			.setName("Configured endpoints")
			.setDesc(
				"You currently have " + endpoints.length + " endpoint(s)."
			)
			.addButton((btn) => {
				btn.setButtonText("View/Edit")
					.setCta()
					.onClick(() => {
						this.showEndpointList(containerEl);
					});
			});

		// Token management section
		this.displayTokenSection(containerEl);

		// Import/Export section
		this.displayImportExportSection(containerEl);
	}

	private displayTokenSection(containerEl: HTMLElement): void {
		containerEl.createEl("h3", { text: "Tokens" });
		containerEl.createEl("div", { text: "Tokens can be referenced in endpoints as {{tokenName}}." });

		const endpointService = this.plugin.getEndpointService();
		const tokens = endpointService.getTokens();

		Object.entries(tokens).forEach(([key, value]) => {
			new Setting(containerEl)
				.setName(key)
				.addText((text) =>
					text.setValue(value).onChange(async (val) => {
						const updatedTokens = { ...tokens, [key]: val };
						await endpointService.updateTokens(updatedTokens);
						await this.plugin.saveSettings();
					})
				)
				.addExtraButton((btn) => {
					btn.setIcon("trash").setTooltip("Delete token").onClick(async () => {
						const updatedTokens = { ...tokens };
						delete updatedTokens[key];
						await endpointService.updateTokens(updatedTokens);
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
						const updatedTokens = { ...tokens, [name]: value };
						await endpointService.updateTokens(updatedTokens);
						await this.plugin.saveSettings();
						this.display();
					}
				});
			});
	}

	private displayImportExportSection(containerEl: HTMLElement): void {
		new Setting(containerEl).addButton((btn) => {
			btn.setButtonText("Import Endpoints JSON").onClick(() => {
				new ImportModal(this.app, this.plugin).open();
			});
		});

		new Setting(containerEl).addButton((btn) => {
			btn.setButtonText("Export Endpoints JSON").onClick(() => {
				const endpointService = this.plugin.getEndpointService();
				const json = JSON.stringify(endpointService.exportEndpoints(), null, 2);
				navigator.clipboard.writeText(json);
				new Notice("Endpoints copied to clipboard");
			});
		});
	}

	showEndpointList(containerEl: HTMLElement) {
		containerEl.empty();

		const endpointService = this.plugin.getEndpointService();
		const endpoints = endpointService.getAllEndpoints();

		endpoints.forEach((endpoint, index) => {
			new Setting(containerEl)
				.setName(endpoint.name)
				.setDesc(endpoint.url)
				.addButton((btn) => {
					btn.setButtonText("Edit").onClick(async () => {
						new EndpointEditorModal(
							this.app,
							endpoint,
							async (updated) => {
								const result = await endpointService.updateEndpoint(endpoint.id, updated);
								if (result.success) {
									await this.plugin.saveSettings();
									this.display();
								} else {
									new Notice(`Error updating endpoint: ${result.error}`);
								}
							}
						).open();
					});
				})
				.addExtraButton((btn) => {
					btn.setIcon("trash")
						.setTooltip("Delete")
						.onClick(async () => {
							const result = await endpointService.deleteEndpoint(endpoint.id);
							if (result.success) {
								await this.plugin.saveSettings();
								this.display();
							} else {
								new Notice(`Error deleting endpoint: ${result.error}`);
							}
						});
				});
		});

		new Setting(containerEl).addButton((btn) => {
			btn.setButtonText("➕ New Endpoint")
				.setCta()
				.onClick(async () => {
					const nuevo: ApiEndpoint = {
						id: "",
						name: "",
						url: "",
						method: HttpMethod.GET,
						headers: {},
						bodyTemplate: undefined,
						insertResponseTo: InsertAction.Modal,
						trigger: [TriggerType.Manual],
						requireConfirmation: false,
					};
					new EndpointEditorModal(this.app, nuevo, async (created) => {
						const result = await endpointService.createEndpoint(created);
						if (result.success) {
							await this.plugin.saveSettings();
							this.display();
						} else {
							new Notice(`Error creating endpoint: ${result.error}`);
						}
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
				.onClick(async () => {
					try {
						const data = JSON.parse(this.textarea.value);
						if (Array.isArray(data)) {
							const endpointService = this.plugin.getEndpointService();
							const result = await endpointService.importEndpoints(data);
							if (result.success) {
								await this.plugin.saveSettings();
								new Notice("Import successful");
								this.close();
							} else {
								new Notice(`Import completed with errors: ${result.errors.join(", ")}`);
								this.close();
							}
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
