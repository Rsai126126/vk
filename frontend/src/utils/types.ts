export type Snapshot = {
    snapshotDate: string; // YYYY-MM-DD
    summary: {
      totalShipments: number;
      totalFailures: number;
      totalStuck: number;
    };
    insights: {
      topWarehouse: string;
      topReason: string;
      oldestStuck: string;
    };
    byWarehouse: Array<{
      warehouse: string;
      stuckCount: number;
      avgAgeHrs: number;
      failureRatePct?: number;
    }>;
  };
  
  const KEY = "recon_snapshots_v1";
  
  function loadAll(): Snapshot[] {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Snapshot[]) : [];
    } catch {
      return [];
    }
  }
  
  function saveAll(list: Snapshot[]) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
  
  export async function saveSnapshotAPI(s: Snapshot): Promise<void> {
    const all = loadAll().filter((x) => x.snapshotDate !== s.snapshotDate);
    all.push(s);
    all.sort(
      (a, b) =>
        new Date(a.snapshotDate).getTime() - new Date(b.snapshotDate).getTime()
    );
    saveAll(all);
  }
  
  export async function loadRecentAPI(days: number): Promise<Snapshot[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    const all = loadAll();
    return all.filter(
      (s) => new Date(s.snapshotDate).getTime() >= cutoff.getTime()
    );
  }
  