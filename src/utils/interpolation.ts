// utils/variables.ts
import { App } from "obsidian";
import { PluginSettings } from "../types";

export function interpolateSettingsVariables(
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

export function interpolateExtraVariables(
	template: string,
	app: App,
	plugin: { manifest: { id: string } }
): string {
	return template
		.replace(/{{date}}/g, new Date().toISOString())
		.replace(/{{vault}}/g, app.vault.getName())
		.replace(/{{plugin-id}}/g, plugin.manifest.id);
}

export function interpolateAllVariables(
	template: string,
	app: App,
	plugin: { settings: PluginSettings; manifest: { id: string } }
): string {
	let result = interpolateSettingsVariables(template, app, plugin);
	result = interpolateExtraVariables(result, app, plugin);
	return result;
}
