// Simple CSV exporter for the filtered table rows
export function exportToCSV(rows: any[], filename: string) {
    if (!Array.isArray(rows) || rows.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = Array.from(
      rows.reduce((set, r) => {
        Object.keys(r || {}).forEach((k) => set.add(k));
        return set;
      }, new Set<string>())
    );
  
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = r?.[h] ?? "";
            const s = String(v).replace(/"/g, '""');
            return /[",\n]/.test(s) ? `"${s}"` : s;
          })
          .join(",")
      ),
    ].join("\n");
  
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  