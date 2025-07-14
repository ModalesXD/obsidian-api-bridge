import { App, Plugin } from "obsidian";
import { ApiEndpoint, TriggerType } from "../types";
import { EndpointService } from "./EndpointService";

export class CommandService {
	private commandIds: string[] = [];

	constructor(
		private app: App,
		private plugin: Plugin,
		private endpointService: EndpointService
	) {}

	registerAllEndpointCommands(): void {
		// Limpiar comandos existentes
		this.unregisterAllCommands();

		// Registrar nuevos comandos
		const endpoints = this.endpointService.getAllEndpoints();
		endpoints.forEach((endpoint) => {
			if (endpoint.trigger?.includes(TriggerType.Manual)) {
				this.registerEndpointCommand(endpoint);
			}
		});
	}

	private registerEndpointCommand(endpoint: ApiEndpoint): void {
		const commandId = `run-endpoint-${endpoint.id}`;
		
		const command = (this.plugin as any).addCommand({
			id: commandId,
			name: `Run: ${endpoint.name}`,
			callback: async () => {
				const result = await this.endpointService.executeEndpoint(endpoint);
				if (!result.success) {
					// El error ya se maneja en el servicio
					console.error("Command execution failed:", result.error);
				}
			},
		});

		this.commandIds.push(command.id);
	}

	private unregisterAllCommands(): void {
		this.commandIds.forEach((id) => {
			(this.plugin as any).removeCommand(id);
		});
		this.commandIds = [];
	}

	// Método para registrar comandos adicionales si es necesario
	registerCustomCommands(): void {
		// Aquí se pueden agregar comandos personalizados adicionales
		// Por ejemplo, comandos para importar/exportar, etc.
	}
} 