import { Notice } from "obsidian";
import { PLUGIN_CONSTANTS } from "../constants";

export class NotificationManager {
	static showSuccess(message: string, duration = 3000): void {
		new Notice(`✅ ${message}`, duration);
	}

	static showError(message: string, duration = 5000): void {
		new Notice(`❌ ${message}`, duration);
	}

	static showWarning(message: string, duration = 4000): void {
		new Notice(`⚠️ ${message}`, duration);
	}

	static showInfo(message: string, duration = 3000): void {
		new Notice(`ℹ️ ${message}`, duration);
	}

	static showEndpointCreated(endpointName: string): void {
		this.showSuccess(`${PLUGIN_CONSTANTS.SUCCESS_MESSAGES.ENDPOINT_CREATED}: ${endpointName}`);
	}

	static showEndpointUpdated(endpointName: string): void {
		this.showSuccess(`${PLUGIN_CONSTANTS.SUCCESS_MESSAGES.ENDPOINT_UPDATED}: ${endpointName}`);
	}

	static showEndpointDeleted(endpointName: string): void {
		this.showSuccess(`${PLUGIN_CONSTANTS.SUCCESS_MESSAGES.ENDPOINT_DELETED}: ${endpointName}`);
	}

	static showEndpointExecuted(endpointName: string): void {
		this.showSuccess(`${PLUGIN_CONSTANTS.SUCCESS_MESSAGES.ENDPOINT_EXECUTED}: ${endpointName}`);
	}

	static showValidationError(field: string, message: string): void {
		this.showError(`Validation error in ${field}: ${message}`);
	}

	static showNetworkError(error: string): void {
		this.showError(`${PLUGIN_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR}: ${error}`);
	}

	static showStorageError(error: string): void {
		this.showError(`${PLUGIN_CONSTANTS.ERROR_MESSAGES.STORAGE_ERROR}: ${error}`);
	}

	static showImportSuccess(count: number): void {
		this.showSuccess(`${PLUGIN_CONSTANTS.SUCCESS_MESSAGES.IMPORT_SUCCESS} (${count} endpoints)`);
	}

	static showImportError(errors: string[]): void {
		const errorMessage = errors.length > 3 
			? `${errors.slice(0, 3).join(", ")} and ${errors.length - 3} more...`
			: errors.join(", ");
		this.showError(`${PLUGIN_CONSTANTS.ERROR_MESSAGES.IMPORT_ERROR}: ${errorMessage}`);
	}

	static showExportSuccess(): void {
		this.showSuccess(PLUGIN_CONSTANTS.SUCCESS_MESSAGES.EXPORT_SUCCESS);
	}

	static showCopiedToClipboard(): void {
		this.showSuccess(PLUGIN_CONSTANTS.SUCCESS_MESSAGES.COPIED_TO_CLIPBOARD);
	}

	static showSavedToNote(fileName: string): void {
		this.showSuccess(`${PLUGIN_CONSTANTS.SUCCESS_MESSAGES.SAVED_TO_NOTE}: ${fileName}`);
	}

	static showExecutionCancelled(): void {
		this.showWarning(PLUGIN_CONSTANTS.ERROR_MESSAGES.EXECUTION_CANCELLED);
	}

	static showResponsePreview(response: string): void {
		const truncated = response.length > PLUGIN_CONSTANTS.RESPONSE.MAX_TOAST_LENGTH
			? response.substring(0, PLUGIN_CONSTANTS.RESPONSE.MAX_TOAST_LENGTH) + "..."
			: response;
		new Notice(`Response:\n${truncated}`, 5000);
	}
}
