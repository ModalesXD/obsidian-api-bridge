import { App, Plugin, Notice, MarkdownView } from "obsidian";
import { ApiEndpoint, InsertAction } from "../../types";
import { interpolateAllVariables } from "../../utils/interpolation";
import { replacePlaceholders } from "../../utils/placeholders";
import { promptUser } from "../input-handler";
import { logExecution } from "../logger";

interface PluginWithSettings extends Plugin {
	settings: any;
}

export class EndpointExecutor {
	constructor(private app: App, private plugin: PluginWithSettings) {}

	async execute(endpoint: ApiEndpoint): Promise<{ success: boolean; error?: string; response?: string }> {
		let { url } = endpoint;
		const { bodyTemplate } = endpoint;
		let vars: Record<string, string> = {};

		try {
			if (this.detectInputNeeded(endpoint)) {
				const input = await this.getUserInput(endpoint);
				if (input === null) return { success: false, error: "Execution cancelled by user" };
				vars = { input };
				url = replacePlaceholders(url, vars) as string;
				// bodyTemplate no se modifica aquí ya que replacePlaceholders no es compatible con BodyTemplate
			}

			url = interpolateAllVariables(url, this.app, this.plugin);
			const headers = this.buildHeaders(endpoint);
			const body = this.buildBody(endpoint, bodyTemplate);

			const responseText = await this.makeRequest(url, headers, body, endpoint.method);

			await this.handleResponse(responseText, endpoint);

			logExecution(this.app, endpoint.id, { url, headers, body }, responseText);

			return { success: true, response: responseText };
		} catch (error: any) {
			return { success: false, error: error?.message ?? String(error) };
		}
	}

	private detectInputNeeded(endpoint: ApiEndpoint): boolean {
		const { url, bodyTemplate } = endpoint;
		return (
			(typeof url === "string" && url.includes("{{input}}")) ||
			(bodyTemplate !== null && typeof bodyTemplate === "object" && JSON.stringify(bodyTemplate).includes("{{input}}"))
		);
	}

	private async getUserInput(endpoint: ApiEndpoint): Promise<string | null> {
		const prompt = endpoint.inputPrompt || "Enter a value for 'input':";
		return await promptUser(this.app, prompt);
	}

	private buildHeaders(endpoint: ApiEndpoint): Record<string, string> {
		const headers: Record<string, string> = {};
		if (endpoint.headers) {
			for (const [key, value] of Object.entries(endpoint.headers)) {
				headers[key] = interpolateAllVariables(value, this.app, this.plugin);
			}
		}
		return headers;
	}

	private buildBody(endpoint: ApiEndpoint, bodyTemplate: any): string | undefined {
		if (endpoint.method === "GET" || !bodyTemplate) return undefined;

		if (typeof bodyTemplate === "string") {
			return interpolateAllVariables(bodyTemplate, this.app, this.plugin);
		}

		if (typeof bodyTemplate === "object" && bodyTemplate !== null) {
			if (bodyTemplate.type === "raw") {
				return interpolateAllVariables(bodyTemplate.value, this.app, this.plugin);
			}
			if (bodyTemplate.type === "object") {
				const interpolated = interpolateAllVariables(JSON.stringify(bodyTemplate.value), this.app, this.plugin);
				return JSON.stringify(JSON.parse(interpolated));
			}
		}
		return undefined;
	}

	private async makeRequest(
		url: string,
		headers: Record<string, string>,
		body: string | undefined,
		method: string
	): Promise<string> {
		const response = await fetch(url, { method, headers, body });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		return await response.text();
	}

	private async handleResponse(responseText: string, endpoint: ApiEndpoint): Promise<void> {
		switch (endpoint.insertResponseTo) {
			case InsertAction.Modal:
				new Notice(`Response:\n${responseText.substring(0, 200)}`);
				break;

			case InsertAction.Clipboard:
				await navigator.clipboard.writeText(responseText);
				new Notice("Response copied to clipboard");
				break;

			case InsertAction.ActiveNote: {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (view) {
					view.editor.replaceSelection(responseText);
				}
				break;
			}

			case InsertAction.NewNote: {
				const fileName = `API Response - ${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.md`;
				await this.app.vault.create(fileName, responseText);
				new Notice(`Response saved to new note: ${fileName}`);
				break;
			}

			case InsertAction.Toast:
				new Notice(`API Response: ${responseText.substring(0, 100)}...`);
				break;

			case InsertAction.None:
			default:
				// No hacer nada
				break;
		}
	}
}
