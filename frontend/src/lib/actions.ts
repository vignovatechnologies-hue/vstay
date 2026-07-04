export function downloadBlob(filename: string, blob: Blob) {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(filename: string, content: string, mime = "text/plain") {
  downloadBlob(filename, new Blob([content], { type: `${mime};charset=utf-8` }));
}

export function downloadCSV<T extends Record<string, unknown>>(filename: string, rows: T[]) {
  if (rows.length === 0) {
    downloadText(filename, "");
    return;
  }
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join(
    "\n",
  );
  downloadText(filename, csv, "text/csv");
}

export function pickFile(accept = "*"): Promise<File | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") return resolve(null);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

export function shortId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function formatShortDate(d = new Date()) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
