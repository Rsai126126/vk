export async function parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
          const [headerLine, ...rows] = lines;
          const headers = headerLine.split(',').map((h) => h.trim());
          const data = rows.map((r) => {
            const values = r.split(',').map((v) => v.trim());
            return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
          });
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
  