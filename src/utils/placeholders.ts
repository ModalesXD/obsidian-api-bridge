export function replacePlaceholders(
	value: string | Record<string, unknown>,
	vars: Record<string, string>
): typeof value {
	if (typeof value === "string") {
		return value.replace(/{{(.*?)}}/g, (_, key) => vars[key] ?? "");
	} else {
		const jsonStr = JSON.stringify(value);
		const replaced = jsonStr.replace(/{{(.*?)}}/g, (_, key) => vars[key] ?? "");
		return JSON.parse(replaced);
	}
}
