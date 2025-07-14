import { Modal, App } from "obsidian";

export async function promptUser(app: App, message: string): Promise<string | null> {
	return new Promise((resolve) => {
		const modal = new PromptModal(app, message, resolve);
		modal.open();
	});
}

export class PromptModal extends Modal {
	private message: string;
	private resolve: (value: string | null) => void;
	private inputEl: HTMLInputElement;

	constructor(app: App, message: string, resolve: (value: string | null) => void) {
		super(app);
		this.message = message;
		this.resolve = resolve;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h3", { text: this.message });
		this.inputEl = contentEl.createEl("input", { type: "text", placeholder: "Enter value..." });
		this.inputEl.focus();

		const submit = () => {
			this.resolve(this.inputEl.value);
			this.close();
		};

		this.inputEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") submit();
			if (e.key === "Escape") {
				this.resolve(null);
				this.close();
			}
		});

		const btn = contentEl.createEl("button", { text: "Accept" });
		btn.onclick = submit;
	}

	onClose() {
		super.onClose();
		if (!this.inputEl.value) this.resolve(null);
	}
}
