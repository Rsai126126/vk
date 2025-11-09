// src/services/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "";

export async function postForm(path: string, form: FormData): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: form });
  if (!res.ok) {
    const msg = await safeErr(res);
    throw new Error(`Request failed ${res.status}: ${msg}`);
  }
  return res;
}

async function safeErr(res: Response) {
  try { const j = await res.json(); return j?.detail || j?.error || res.statusText; }
  catch { return res.statusText; }
}
