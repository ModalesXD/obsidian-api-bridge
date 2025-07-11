import { App } from "obsidian";
import { PluginSettings } from "./types";
export function interpolateVariables(
	template: string,
	app: App,
	plugin: { settings: PluginSettings }
): string {
	const activeFile = app.workspace.getActiveFile();
	let result = template;

	if (activeFile) {
		result = result
			.replace(/{{title}}/g, activeFile.basename)
			.replace(/{{filepath}}/g, activeFile.path);
	}

	result = result.replace(
		/{{token}}/g,
		plugin.settings.tokens["default"] || ""
	);

	return result;
}
