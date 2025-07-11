export interface ApiEndpoint {
	id: string;
	name: string;
	url: string;
	method: HttpMethod;
	headers?: Record<string, string>;
	bodyTemplate?: Record<string, unknown> | string;
	trigger?: TriggerType[];
	insertResponseTo?: InsertAction;
	requireConfirmation?: boolean;
	responseParser?: string;
	inputPrompt?: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type InsertAction =
	| "none"
	| "modal"
	| "toast"
	| "note"
	| "new-note"
	| "clipboard";

export type TriggerType =
	| "manual"
	| "onNoteOpen"
	| "onNoteSave"
	| "onSelection";

export interface PluginSettings {
	endpoints: ApiEndpoint[];
	tokens: Record<string, string>;
}
