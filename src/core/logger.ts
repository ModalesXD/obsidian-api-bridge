import { App, Notice, TFile } from "obsidian";

export async function logExecution(
  app: App,
  id: string,
  request: Record<string, unknown>,
  response: string
): Promise<void> {
  const folder = ".api-bridge-logs";
  const dateStr = new Date().toISOString().slice(0, 10);
  const path = `${folder}/${dateStr}.json`;

  const safeResponse =
    response.length > 1000 ? response.slice(0, 1000) + "\n...(truncated)" : response;

  const newEntry = {
    id,
    timestamp: new Date().toISOString(),
    request,
    response: safeResponse,
  };

  try {
    if (!app.vault.getAbstractFileByPath(folder)) {
      await app.vault.createFolder(folder);
    }

    let logs = [];

    const file = app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      const content = await app.vault.read(file);
      try {
        logs = JSON.parse(content);
        if (!Array.isArray(logs)) logs = [];
      } catch {
        logs = [];
      }
      logs.push(newEntry);
      const updatedContent = JSON.stringify(logs, null, 2);
      await app.vault.modify(file, updatedContent);
    } else {
      logs.push(newEntry);
      const content = JSON.stringify(logs, null, 2);
      await app.vault.create(path, content);
    }

    new Notice(`Log diario actualizado: ${path}`, 3000);
  } catch (error) {
    console.error("Error guardando log diario:", error);
    new Notice("Error guardando log diario. Revisa la consola.", 4000);
  }
}
