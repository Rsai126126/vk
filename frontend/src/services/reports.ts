// src/services/reports.ts
export type Snapshot = {
    snapshotDate: string; // YYYY-MM-DD
    summary: { totalShipments: number; totalFailures: number; totalStuck: number };
    insights: { topWarehouse: string; topReason: string; oldestStuck: string };
    byWarehouse: Array<{ warehouse: string; stuckCount: number; avgAgeHrs: number; failureRatePct?: number }>;
  };
  
  const KEY = "tp_recon_snapshots_v1";
  
  function loadAll(): Snapshot[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  
  function saveAll(arr: Snapshot[]) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }
  
  export async function saveSnapshotAPI(s: Snapshot): Promise<void> {
    const all = loadAll();
    const i = all.findIndex((x) => x.snapshotDate === s.snapshotDate);
    if (i >= 0) all[i] = s;
    else all.push(s);
    saveAll(all);
  }
  
  export async function loadRecentAPI(days: number): Promise<Snapshot[]> {
    const all = loadAll();
    const sorted = all.sort(
      (a, b) => new Date(a.snapshotDate).getTime() - new Date(b.snapshotDate).getTime()
    );
    return sorted.slice(-Math.max(1, days));
  }
  