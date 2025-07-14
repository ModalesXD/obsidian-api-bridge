import { Plugin, addIcon } from "obsidian";
import { APIBridgeSettingTab } from "./ui/settings";
import { PluginSettings } from "./types";
import { DEFAULT_SETTINGS } from "./ui/settings";
import { EndpointsRibbonModal } from "./ui/modal-endpoints";
import { EndpointService } from "./services/EndpointService";
import { CommandService } from "./services/CommandService";
import { EventService } from "./services/EventService";

export default class APIBridgePlugin extends Plugin {
	settings: PluginSettings;
	private endpointService: EndpointService;
	private commandService: CommandService;
	private eventService: EventService;

	async onload() {
		await this.loadSettings();
		
		// Inicializar servicios
		this.endpointService = new EndpointService(this.app, this);
		this.commandService = new CommandService(this.app, this, this.endpointService);
		this.eventService = new EventService(this.app, this, this.endpointService);

		// Configurar UI
		this.addSettingTab(new APIBridgeSettingTab(this.app, this));

		// Registrar comandos
		this.commandService.registerAllEndpointCommands();

		// Registrar eventos
		this.eventService.registerEventHandlers();

		// Configurar icono del ribbon
		addIcon("api", `<path d="M3 12h18M12 3v18"/>`);
		this.addRibbonIcon("api", "API Bridge", async () => {
			new EndpointsRibbonModal(this.app, this).open();
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.commandService.registerAllEndpointCommands();
	}

	// Métodos públicos para acceder a los servicios
	getEndpointService(): EndpointService {
		return this.endpointService;
	}

	getCommandService(): CommandService {
		return this.commandService;
	}

	getEventService(): EventService {
		return this.eventService;
	}
}
