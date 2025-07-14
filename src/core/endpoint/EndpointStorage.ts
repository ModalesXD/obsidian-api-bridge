import { Plugin } from "obsidian";
import { ApiEndpoint, PluginSettings } from "../../types";

export class EndpointStorage {
	constructor(private plugin: Plugin) {}

	async addEndpoint(endpoint: ApiEndpoint): Promise<void> {
		const settings = this.getSettings();
		settings.endpoints.push(endpoint);
		await this.saveSettings(settings);
	}

	async updateEndpoint(endpointId: string, updatedEndpoint: ApiEndpoint): Promise<void> {
		const settings = this.getSettings();
		const index = settings.endpoints.findIndex(ep => ep.id === endpointId);
		
		if (index === -1) {
			throw new Error(`Endpoint with ID "${endpointId}" not found`);
		}

		settings.endpoints[index] = updatedEndpoint;
		await this.saveSettings(settings);
	}

	async deleteEndpoint(endpointId: string): Promise<void> {
		const settings = this.getSettings();
		const index = settings.endpoints.findIndex(ep => ep.id === endpointId);
		
		if (index === -1) {
			throw new Error(`Endpoint with ID "${endpointId}" not found`);
		}

		settings.endpoints.splice(index, 1);
		await this.saveSettings(settings);
	}

	getAllEndpoints(): ApiEndpoint[] {
		return this.getSettings().endpoints;
	}

	getEndpointById(id: string): ApiEndpoint | undefined {
		return this.getSettings().endpoints.find(ep => ep.id === id);
	}

	async importEndpoints(endpoints: ApiEndpoint[]): Promise<void> {
		const settings = this.getSettings();
		settings.endpoints = [...settings.endpoints, ...endpoints];
		await this.saveSettings(settings);
	}

	async replaceAllEndpoints(endpoints: ApiEndpoint[]): Promise<void> {
		const settings = this.getSettings();
		settings.endpoints = endpoints;
		await this.saveSettings(settings);
	}

	async updateTokens(tokens: Record<string, string>): Promise<void> {
		const settings = this.getSettings();
		settings.tokens = tokens;
		await this.saveSettings(settings);
	}

	getTokens(): Record<string, string> {
		return this.getSettings().tokens;
	}

	private getSettings(): PluginSettings {
		return (this.plugin as any).settings || { endpoints: [], tokens: {} };
	}

	private async saveSettings(settings: PluginSettings): Promise<void> {
		(this.plugin as any).settings = settings;
		await (this.plugin as any).saveData(settings);
	}
} 