import { Modal, App } from "obsidian";
import type APIBridgePlugin from "../main";
import type { ApiEndpoint } from "../types";

export class EndpointsRibbonModal extends Modal {
	plugin: APIBridgePlugin;
	constructor(app: App, plugin: APIBridgePlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h2", { text: "Available Endpoints" });

		if (this.plugin.settings.endpoints.length === 0) {
			contentEl.createEl("div", { text: "No endpoints configured." });
			return;
		}

		this.plugin.settings.endpoints.forEach((endpoint: ApiEndpoint) => {
			const row = contentEl.createEl("div", { cls: "api-bridge-endpoint-row" });

			row.createEl("b", { text: endpoint.name });
			row.createEl("span", { text: ` | ${endpoint.url}` });

			const runBtn = row.createEl("button", { text: "Run" });
			runBtn.onclick = async () => {
				const endpointService = this.plugin.getEndpointService();
				await endpointService.executeEndpoint(endpoint);
				this.close();
			};
		});
	}
}
