//#region src/lib/actions.ts
function downloadBlob(filename, blob) {
	if (typeof window === "undefined") return;
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function downloadText(filename, content, mime = "text/plain") {
	downloadBlob(filename, new Blob([content], { type: `${mime};charset=utf-8` }));
}
function downloadCSV(filename, rows) {
	if (rows.length === 0) {
		downloadText(filename, "");
		return;
	}
	const headers = Object.keys(rows[0]);
	const esc = (v) => {
		const s = v == null ? "" : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	downloadText(filename, [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n"), "text/csv");
}
function pickFile(accept = "*") {
	return new Promise((resolve) => {
		if (typeof document === "undefined") return resolve(null);
		const input = document.createElement("input");
		input.type = "file";
		input.accept = accept;
		input.onchange = () => resolve(input.files?.[0] ?? null);
		input.click();
	});
}
function shortId(prefix) {
	return `${prefix}-${Math.floor(Math.random() * 9e3 + 1e3)}`;
}
function formatShortDate(d = /* @__PURE__ */ new Date()) {
	return d.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
//#endregion
export { shortId as a, pickFile as i, downloadText as n, formatShortDate as r, downloadCSV as t };
