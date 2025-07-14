import {
	App,
	Modal,
	Setting,
	TextComponent,
	ButtonComponent,
	Notice,
} from "obsidian";
import { ApiEndpoint, HttpMethod } from "../types";

export class EndpointEditorModal extends Modal {
	endpoint: ApiEndpoint;
	onSave: (updated: ApiEndpoint) => void;

	constructor(
		app: App,
		endpoint: ApiEndpoint,
		onSave: (updated: ApiEndpoint) => void
	) {
		super(app);
		this.endpoint = { ...endpoint };
		this.onSave = onSave;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", {
			text: this.endpoint.id ? "Edit Endpoint" : "New Endpoint",
		});

		new Setting(contentEl)
			.setName("Name")
			.addText((text: TextComponent) =>
				text
					.setValue(this.endpoint.name)
					.onChange((val) => (this.endpoint.name = val))
			);

		new Setting(contentEl)
			.setName("ID (unique)")
			.addText((text: TextComponent) =>
				text
					.setValue(this.endpoint.id)
					.onChange((val) => (this.endpoint.id = val))
			);

		new Setting(contentEl)
			.setName("URL")
			.addText((text: TextComponent) =>
				text
					.setValue(this.endpoint.url)
					.onChange((val) => (this.endpoint.url = val))
			);

		new Setting(contentEl).setName("HTTP Method").addDropdown((drop) => {
			const methods: HttpMethod[] = [
				HttpMethod.GET,
				HttpMethod.POST,
				HttpMethod.PUT,
				HttpMethod.DELETE,
				HttpMethod.PATCH,
			];
			methods.forEach((m) => drop.addOption(m, m));
			drop.setValue(this.endpoint.method);
			drop.onChange(
				(value) => (this.endpoint.method = value as HttpMethod)
			);
		});

		new Setting(contentEl).setName("Headers (JSON)").addTextArea((text) => {
			text.setValue(JSON.stringify(this.endpoint.headers || {}, null, 2));
			text.inputEl.rows = 4;
			text.onChange((val) => {
				try {
					this.endpoint.headers = JSON.parse(val);
				} catch (e) {
					new Notice("Invalid headers");
				}
			});
		});

		new Setting(contentEl)
			.setName("Body (Body Template JSON)")
			.addTextArea((text) => {
				text.setValue(
					typeof this.endpoint.bodyTemplate === "object"
						? JSON.stringify(this.endpoint.bodyTemplate, null, 2)
						: this.endpoint.bodyTemplate || ""
				);
				text.inputEl.rows = 4;
				text.onChange((val) => {
					try {
						this.endpoint.bodyTemplate = JSON.parse(val);
					} catch (e) {
						// Si no es JSON válido, no asignar nada
						console.warn("Invalid JSON for body template");
					}
				});
			});

		new Setting(contentEl).addButton((btn) => {
			btn.setButtonText("Test Endpoint")
				.setCta()
				.onClick(async () => {
					try {
						const res = await fetch(this.endpoint.url, {
							method: this.endpoint.method,
							headers: this.endpoint.headers,
							body:
								typeof this.endpoint.bodyTemplate === "string"
									? this.endpoint.bodyTemplate
									: JSON.stringify(
										this.endpoint.bodyTemplate
									),
						});
						const text = await res.text();
						new Notice(`Response: ${text.substring(0, 200)}`);
					} catch (e) {
						new Notice("Error testing endpoint: " + e.message);
					}
				});
		});

		new Setting(contentEl).addButton((btn: ButtonComponent) => {
			btn.setButtonText("Save")
				.setCta()
				.onClick(() => {
					this.onSave(this.endpoint);
					this.close();
				});
		});

		new Setting(contentEl).addButton((btn: ButtonComponent) => {
			btn.setButtonText("Cancel").onClick(() => this.close());
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
