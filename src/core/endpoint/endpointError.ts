export class EndpointError extends Error {
	constructor(message: string, public readonly code: string) {
		super(message);
		this.name = 'EndpointError';
	}
}

export class ValidationError extends EndpointError {
	constructor(message: string, public readonly field?: string) {
		super(message, 'VALIDATION_ERROR');
		this.name = 'ValidationError';
	}
}

export class ExecutionError extends EndpointError {
	constructor(message: string, public readonly statusCode?: number) {
		super(message, 'EXECUTION_ERROR');
		this.name = 'ExecutionError';
	}
}

export class StorageError extends EndpointError {
	constructor(message: string) {
		super(message, 'STORAGE_ERROR');
		this.name = 'StorageError';
	}
}

export class ConfigurationError extends EndpointError {
	constructor(message: string) {
		super(message, 'CONFIGURATION_ERROR');
		this.name = 'ConfigurationError';
	}
}
