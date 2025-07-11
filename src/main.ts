import { Plugin, Notice, addIcon, MarkdownView, Modal, App } from "obsidian";
import { DEFAULT_SETTINGS, APIBridgeSettingTab } from "./settings";
import type { PluginSettings, ApiEndpoint } from "./types";
import { TriggerType, InsertAction } from "./types";
import { interpolateVariables } from "./utils";

export default class APIBridgePlugin extends Plugin {
	settings: PluginSettings;
	private endpointCommandIds: string[] = [];

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new APIBridgeSettingTab(this.app, this));
		this.registerAllEndpointCommands();

		addIcon("api", `<path d="M3 12h18M12 3v18"/>`);
		this.addRibbonIcon("api", "API Bridge", async () => {
			new EndpointsRibbonModal(this.app, this).open();
		});
	}

	registerAllEndpointCommands() {
		// Remove previous commands
		if (this.endpointCommandIds) {
			this.endpointCommandIds.forEach((id) => this.removeCommand(id));
		}
		this.endpointCommandIds = [];
		this.settings.endpoints.forEach((endpoint) => {
			if (endpoint.trigger?.includes(TriggerType.Manual)) {
				const cmd = this.addCommand({
					id: `run-endpoint-${endpoint.id}`,
					name: `Run: ${endpoint.name}`,
					callback: () => this.executeEndpoint(endpoint),
				});
				this.endpointCommandIds.push(cmd.id);
			}
		});
	}

	async executeEndpoint(endpoint: ApiEndpoint) {
		let url = endpoint.url;
		let bodyTemplate = endpoint.bodyTemplate;

		if (
			url.includes("{{input}}") ||
			(typeof bodyTemplate === "string" &&
				bodyTemplate.includes("{{input}}"))
		) {
			const input = await this.promptUser(
				"Enter a value for 'input':"
			);
			if (input === null) {
				new Notice("Execution cancelled");
				return;
			}
			url = url.replace(/{{input}}/g, input);
			if (typeof bodyTemplate === "string") {
				bodyTemplate = bodyTemplate.replace(/{{input}}/g, input);
			} else if (typeof bodyTemplate === "object") {
				const jsonStr = JSON.stringify(bodyTemplate);
				const replaced = jsonStr.replace(/{{input}}/g, input);
				bodyTemplate = JSON.parse(replaced);
			}
		}

		url = interpolateVariables(url, this.app, this);
		const headers: Record<string, string> = {};
		for (const [k, v] of Object.entries(endpoint.headers || {})) {
			headers[k] = interpolateVariables(v, this.app, this);
		}

		let body: string | undefined = undefined;
		if (endpoint.method !== "GET" && bodyTemplate) {
			body =
				typeof bodyTemplate === "string"
					? interpolateVariables(bodyTemplate, this.app, this)
					: JSON.stringify(
						JSON.parse(
							interpolateVariables(
								JSON.stringify(bodyTemplate),
								this.app,
								this
							)
						)
					);
		}

		try {
			const res = await fetch(url, {
				method: endpoint.method,
				headers,
				body,
			});

			const text = await res.text();

			if (endpoint.insertResponseTo === "modal") {
				new Notice(`Response:\n${text.substring(0, 200)}`);
			} else if (endpoint.insertResponseTo === "clipboard") {
				await navigator.clipboard.writeText(text);
				new Notice("Response copied to clipboard");
			} else if (endpoint.insertResponseTo === InsertAction.ActiveNote) {
				const activeView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView) {
					activeView.editor.replaceSelection(text);
				}
			}

			this.logExecution(endpoint.id, { url, headers, body }, text);
		} catch (e) {
			new Notice("Error executing endpoint: " + e.message);
		}
	}

	async promptUser(message: string): Promise<string | null> {
		return new Promise((resolve) => {
			const modal = new PromptModal(this.app, message, resolve);
			modal.open();
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.registerAllEndpointCommands();
	}

	async logExecution(
		id: string,
		request: Record<string, unknown>,
		response: string
	) {
		const folder = ".api-bridge-logs";
		if (!this.app.vault.getAbstractFileByPath(folder)) {
			await this.app.vault.createFolder(folder);
		}
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const path = `${folder}/${id}-${timestamp}.md`;
		const content = `# Execution log - ${id}\n\n## Request\n\
json\n${JSON.stringify(request, null, 2)}\n\
\n## Response\n\
${response}\n\
`;
		await this.app.vault.create(path, content);
	}
}

class PromptModal extends Modal {
	private message: string;
	private resolve: (value: string | null) => void;
	private inputEl: HTMLInputElement;

	constructor(
		app: App,
		message: string,
		resolve: (value: string | null) => void
	) {
		super(app);
		this.message = message;
		this.resolve = resolve;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h3", { text: this.message });
		this.inputEl = contentEl.createEl("input", { type: "text" });
		this.inputEl.focus();

		const submit = () => {
			this.resolve(this.inputEl.value);
			this.close();
		};

		this.inputEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") submit();
			if (e.key === "Escape") {
				this.resolve(null);
				this.close();
			}
		});

		const btn = contentEl.createEl("button", { text: "Accept" });
		btn.onclick = submit;
	}

	onClose() {
		super.onClose();
		if (!this.inputEl.value) this.resolve(null);
	}
}

// Modal to list and run endpoints from the ribbon
class EndpointsRibbonModal extends Modal {
	plugin: APIBridgePlugin;

	constructor(app: App, plugin: APIBridgePlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Available Endpoints" });
		if (this.plugin.settings.endpoints.length === 0) {
			contentEl.createEl("div", { text: "No endpoints configured." });
			return;
		}
		this.plugin.settings.endpoints.forEach((endpoint) => {
			const row = contentEl.createEl("div", { cls: "api-bridge-endpoint-row" });
			row.createEl("b", { text: endpoint.name });
			row.createEl("span", { text: ` | ${endpoint.url}` });
			const btn = row.createEl("button", { text: "Run" });
			btn.onclick = () => {
				this.plugin.executeEndpoint(endpoint);
				this.close();
			};
		});
	}
}
