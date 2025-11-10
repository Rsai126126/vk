export interface StuckShipment {
  Pickticket: string;
  Order: string;
  Warehouse: string;
  "Ship To": string;
  "Issue Summary": string;
  "EDI Message"?: string;
  AgeHours?: number;
  Severity?: "high" | "medium" | "low";
  Price?: number;
  "Age Badge Class"?: string;
}

export interface ReconciliationResult {
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
  stuckShipments: StuckShipment[];
}
