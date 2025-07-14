import { ApiEndpoint, HttpMethod, InsertAction, TriggerType } from "../../types";

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export class EndpointValidator {
	validate(endpoint: ApiEndpoint): ValidationResult {
		const errors: string[] = [];

		// Validar campos requeridos
		if (!endpoint.id || endpoint.id.trim() === "") {
			errors.push("ID is required");
		}

		if (!endpoint.name || endpoint.name.trim() === "") {
			errors.push("Name is required");
		}

		if (!endpoint.url || endpoint.url.trim() === "") {
			errors.push("URL is required");
		}

		// Validar URL
		if (endpoint.url && endpoint.url.trim() !== "") {
			try {
				new URL(endpoint.url);
			} catch {
				errors.push("Invalid URL format");
			}
		}

		// Validar método HTTP
		if (!Object.values(HttpMethod).includes(endpoint.method)) {
			errors.push("Invalid HTTP method");
		}

		// Validar headers
		if (endpoint.headers) {
			for (const [key, value] of Object.entries(endpoint.headers)) {
				if (!key || key.trim() === "") {
					errors.push("Header key cannot be empty");
				}
				if (value === undefined || value === null) {
					errors.push(`Header value for "${key}" cannot be null or undefined`);
				}
			}
		}

		// Validar body template
		if (endpoint.bodyTemplate) {
			if (typeof endpoint.bodyTemplate === "object" && endpoint.bodyTemplate !== null) {
				// Validar estructura del objeto body template
				const bodyTemplate = endpoint.bodyTemplate as { type?: string; value?: any };
				if (!bodyTemplate.type || !bodyTemplate.value) {
					errors.push("Body template object must have 'type' and 'value' properties");
				} else if (!["object", "raw"].includes(bodyTemplate.type)) {
					errors.push("Body template type must be 'object' or 'raw'");
				}
			}
		}

		// Validar trigger types
		if (endpoint.trigger && endpoint.trigger.length > 0) {
			for (const trigger of endpoint.trigger) {
				if (!Object.values(TriggerType).includes(trigger)) {
					errors.push(`Invalid trigger type: ${trigger}`);
				}
			}
		} else {
			errors.push("At least one trigger type is required");
		}

		// Validar insert action
		if (endpoint.insertResponseTo && !Object.values(InsertAction).includes(endpoint.insertResponseTo)) {
			errors.push("Invalid insert action");
		}

		// Validar response parser (si se proporciona)
		if (endpoint.responseParser && typeof endpoint.responseParser === "string" && endpoint.responseParser.trim() !== "") {
			try {
				// Intentar parsear como JSON para validar sintaxis
				JSON.parse(endpoint.responseParser);
			} catch {
				errors.push("Response parser must be valid JSON");
			}
		}

		// Validar input prompt (si se proporciona)
		if (endpoint.inputPrompt && endpoint.inputPrompt.trim() === "") {
			errors.push("Input prompt cannot be empty if provided");
		}

		// Validar meta data (si se proporciona)
		if (endpoint.meta && typeof endpoint.meta !== "object") {
			errors.push("Meta data must be an object");
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	validateUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	validateJson(jsonString: string): boolean {
		try {
			JSON.parse(jsonString);
			return true;
		} catch {
			return false;
		}
	}

	validateEndpointId(id: string, existingEndpoints: ApiEndpoint[]): ValidationResult {
		const errors: string[] = [];

		if (!id || id.trim() === "") {
			errors.push("ID is required");
		} else {
			// Verificar que el ID sea único
			const existingEndpoint = existingEndpoints.find(ep => ep.id === id);
			if (existingEndpoint) {
				errors.push("ID must be unique");
			}

			// Verificar formato del ID (solo letras, números, guiones y guiones bajos)
			if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
				errors.push("ID can only contain letters, numbers, hyphens, and underscores");
			}
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}
} 