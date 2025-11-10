// Simple CSV exporter for the filtered table rows
export function exportToCSV(rows: Record<string, any>[], filename: string) {
    if (!Array.isArray(rows) || rows.length === 0) {
      alert("No data to export");
      return;
    }
    const headers: string[] = [];
    const uniqueKeys = new Set<string>();
    rows.forEach((r) => {
      if (r) Object.keys(r).forEach((k) => uniqueKeys.add(k));
    });
    headers.push(...Array.from(uniqueKeys));
  
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = (r as Record<string, any>)?.[h] ?? "";
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
  