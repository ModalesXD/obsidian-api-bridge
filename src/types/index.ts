export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type BodyTemplate =
  | { type: 'object'; value: JsonObject }
  | { type: 'raw'; value: string };

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"
}

export enum InsertAction {
  None = "none",
  Modal = "modal",
  Toast = "toast",
  ActiveNote = "note",
  NewNote = "new-note",
  Clipboard = "clipboard"
}

export enum TriggerType {
  Manual = "manual",
  OnNoteOpen = "onNoteOpen",
  OnNoteSave = "onNoteSave",
  OnSelection = "onSelection"
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  bodyTemplate?: BodyTemplate;
  trigger?: TriggerType[];
  insertResponseTo?: InsertAction;
  requireConfirmation?: boolean;
  responseParser?: string;
  inputPrompt?: string;
  meta?: JsonObject;
}

export interface ExecutionResult {
  success: boolean;
  error?: string;
  response?: string;
}

export interface PluginSettings {
  endpoints: ApiEndpoint[];
  tokens: Record<string, string>;
  debugMode?: boolean;
  timeoutMs?: number;
}
