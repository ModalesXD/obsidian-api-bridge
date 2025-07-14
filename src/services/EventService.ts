import { App, Plugin, MarkdownView } from "obsidian";
import { TriggerType } from "../types";
import { EndpointService } from "./EndpointService";

export class EventService {
	constructor(
		private app: App,
		private plugin: Plugin,
		private endpointService: EndpointService
	) {}

	registerEventHandlers(): void {
		// Registrar eventos para triggers automáticos
		this.registerNoteOpenHandler();
		this.registerNoteSaveHandler();
		this.registerSelectionHandler();
	}

	private registerNoteOpenHandler(): void {
		this.app.workspace.on("file-open", async (file) => {
			if (!file) return;

			const endpoints = this.endpointService.getAllEndpoints();
			const relevantEndpoints = endpoints.filter(ep => 
				ep.trigger?.includes(TriggerType.OnNoteOpen)
			);

			for (const endpoint of relevantEndpoints) {
				try {
					await this.endpointService.executeEndpoint(endpoint);
				} catch (error) {
					console.error(`Error executing endpoint ${endpoint.name} on note open:`, error);
				}
			}
		});
	}

	private registerNoteSaveHandler(): void {
		this.app.vault.on("modify", async (file) => {
			if (!file) return;

			const endpoints = this.endpointService.getAllEndpoints();
			const relevantEndpoints = endpoints.filter(ep => 
				ep.trigger?.includes(TriggerType.OnNoteSave)
			);

			for (const endpoint of relevantEndpoints) {
				try {
					await this.endpointService.executeEndpoint(endpoint);
				} catch (error) {
					console.error(`Error executing endpoint ${endpoint.name} on note save:`, error);
				}
			}
		});
	}

	private registerSelectionHandler(): void {
		this.app.workspace.on("editor-change", async (editor, info: any) => {
			// Defensive: info may be a MarkdownView or MarkdownFileInfo, or undefined.
			// Only proceed if info is an object and has a 'type' property equal to 'selection'.
			if (!info || typeof info !== "object" || (info as any).type !== "selection") return;

			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) return;

			const selection = editor.getSelection();
			if (!selection || selection.trim() === "") return;

			const endpoints = this.endpointService.getAllEndpoints();
			const relevantEndpoints = endpoints.filter(ep => 
				ep.trigger?.includes(TriggerType.OnSelection)
			);

			for (const endpoint of relevantEndpoints) {
				try {
					// Aquí podrías pasar la selección como contexto al endpoint
					await this.endpointService.executeEndpoint(endpoint);
				} catch (error) {
					console.error(`Error executing endpoint ${endpoint.name} on selection:`, error);
				}
			}
		});
	}

	// Método para limpiar todos los event handlers si es necesario
	unregisterEventHandlers(): void {
		// En Obsidian, los event handlers se limpian automáticamente
		// cuando el plugin se desactiva, pero aquí podrías agregar
		// lógica adicional si es necesario
	}
} 