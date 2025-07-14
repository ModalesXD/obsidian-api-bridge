export const PLUGIN_CONSTANTS = {
	PLUGIN_ID: 'obsidian-api-bridge',
	PLUGIN_NAME: 'API Bridge',
	VERSION: '1.0.0',
	
	// Comandos
	COMMAND_PREFIX: 'run-endpoint-',
	
	// Eventos
	EVENTS: {
		ENDPOINT_CREATED: 'endpoint-created',
		ENDPOINT_UPDATED: 'endpoint-updated',
		ENDPOINT_DELETED: 'endpoint-deleted',
		ENDPOINT_EXECUTED: 'endpoint-executed',
		ENDPOINT_ERROR: 'endpoint-error'
	},
	
	// Validación
	VALIDATION: {
		MAX_URL_LENGTH: 2048,
		MAX_NAME_LENGTH: 100,
		MAX_HEADERS_COUNT: 50,
		MAX_BODY_SIZE: 1024 * 1024, // 1MB
		ID_PATTERN: /^[a-zA-Z0-9_-]+$/
	},
	
	// Respuestas
	RESPONSE: {
		MAX_TOAST_LENGTH: 200,
		MAX_CLIPBOARD_LENGTH: 10000,
		MAX_NOTE_INSERT_LENGTH: 50000
	},
	
	// Timeouts
	TIMEOUTS: {
		REQUEST_TIMEOUT: 30000, // 30 segundos
		USER_INPUT_TIMEOUT: 60000 // 1 minuto
	},
	
	// Mensajes de error
	ERROR_MESSAGES: {
		INVALID_URL: 'Invalid URL format',
		INVALID_JSON: 'Invalid JSON format',
		REQUIRED_FIELD: 'This field is required',
		DUPLICATE_ID: 'Endpoint ID must be unique',
		NETWORK_ERROR: 'Network error occurred',
		VALIDATION_FAILED: 'Validation failed',
		EXECUTION_CANCELLED: 'Execution cancelled by user',
		STORAGE_ERROR: 'Failed to save data',
		IMPORT_ERROR: 'Failed to import endpoints',
		EXPORT_ERROR: 'Failed to export endpoints'
	},
	
	// Mensajes de éxito
	SUCCESS_MESSAGES: {
		ENDPOINT_CREATED: 'Endpoint created successfully',
		ENDPOINT_UPDATED: 'Endpoint updated successfully',
		ENDPOINT_DELETED: 'Endpoint deleted successfully',
		ENDPOINT_EXECUTED: 'Endpoint executed successfully',
		IMPORT_SUCCESS: 'Endpoints imported successfully',
		EXPORT_SUCCESS: 'Endpoints exported successfully',
		COPIED_TO_CLIPBOARD: 'Response copied to clipboard',
		SAVED_TO_NOTE: 'Response saved to note'
	}
} as const;

export const DEFAULT_ENDPOINT_CONFIG = {
	id: '',
	name: '',
	url: '',
	method: 'GET' as const,
	headers: {},
	bodyTemplate: undefined,
	trigger: ['manual'] as const,
	insertResponseTo: 'modal' as const,
	requireConfirmation: false,
	responseParser: undefined,
	inputPrompt: undefined,
	meta: {}
} as const;

export const SUPPORTED_HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
export const SUPPORTED_TRIGGER_TYPES = ['manual', 'onNoteOpen', 'onNoteSave', 'onSelection'] as const;
export const SUPPORTED_INSERT_ACTIONS = ['none', 'modal', 'toast', 'note', 'new-note', 'clipboard'] as const; 