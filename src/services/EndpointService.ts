import { App, Plugin } from "obsidian";
import { ApiEndpoint, PluginSettings } from "../types";
import { EndpointValidator } from "../core/endpoint/endpointValidator";
import { EndpointExecutor } from "../core/endpoint/EndpointExecutor";
import { EndpointStorage } from "../core/endpoint/EndpointStorage";

interface PluginWithSettings extends Plugin {
	settings: PluginSettings;
}

export class EndpointService {
	private validator: EndpointValidator;
	private executor: EndpointExecutor;
	private storage: EndpointStorage;

	constructor(private app: App, private plugin: PluginWithSettings) {
		this.validator = new EndpointValidator();
		this.executor = new EndpointExecutor(app, plugin);
		this.storage = new EndpointStorage(plugin);
	}

	async createEndpoint(endpoint: ApiEndpoint): Promise<{ success: boolean; error?: string }> {
		const validation = this.validator.validate(endpoint);
		if (!validation.isValid) {
			return { success: false, error: validation.errors.join(", ") };
		}

		try {
			await this.storage.addEndpoint(endpoint);
			return { success: true };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
		}
	}

	async updateEndpoint(endpointId: string, updatedEndpoint: ApiEndpoint): Promise<{ success: boolean; error?: string }> {
		const validation = this.validator.validate(updatedEndpoint);
		if (!validation.isValid) {
			return { success: false, error: validation.errors.join(", ") };
		}

		try {
			await this.storage.updateEndpoint(endpointId, updatedEndpoint);
			return { success: true };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
		}
	}

	async deleteEndpoint(endpointId: string): Promise<{ success: boolean; error?: string }> {
		try {
			await this.storage.deleteEndpoint(endpointId);
			return { success: true };
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
		}
	}

	async executeEndpoint(endpoint: ApiEndpoint): Promise<{ success: boolean; error?: string; response?: string }> {
		const validation = this.validator.validate(endpoint);
		if (!validation.isValid) {
			return { success: false, error: validation.errors.join(", ") };
		}

		try {
			const result = await this.executor.execute(endpoint);
			return result;
		} catch (error) {
			return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
		}
	}

	getAllEndpoints(): ApiEndpoint[] {
		return this.storage.getAllEndpoints();
	}

	getEndpointById(id: string): ApiEndpoint | undefined {
		return this.storage.getEndpointById(id);
	}

	async importEndpoints(endpoints: ApiEndpoint[]): Promise<{ success: boolean; errors: string[] }> {
		const errors: string[] = [];
		const validEndpoints: ApiEndpoint[] = [];

		for (const endpoint of endpoints) {
			const validation = this.validator.validate(endpoint);
			if (!validation.isValid) {
				errors.push(`Endpoint "${endpoint.name}": ${validation.errors.join(", ")}`);
			} else {
				validEndpoints.push(endpoint);
			}
		}

		if (validEndpoints.length > 0) {
			try {
				await this.storage.importEndpoints(validEndpoints);
			} catch (error) {
				errors.push(error instanceof Error ? error.message : "Import failed");
			}
		}

		return { success: errors.length === 0, errors };
	}

	exportEndpoints(): ApiEndpoint[] {
		return this.storage.getAllEndpoints();
	}

	async updateTokens(tokens: Record<string, string>): Promise<void> {
		await this.storage.updateTokens(tokens);
	}

	getTokens(): Record<string, string> {
		return this.storage.getTokens();
	}
} 