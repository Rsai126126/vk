// src/services/reconciliationApi.ts
import { postForm } from "./api";

export async function postReconciliationExcel(
  shipment_history: File,
  edib2bi: File,
  edi940: File
): Promise<Blob> {
  const form = new FormData();
  form.set("shipment_history", shipment_history);
  form.set("edib2bi", edib2bi);
  form.set("edi940", edi940);
  const res = await postForm("/reconciliation/ship-confirmation-reconciliation", form);
  return await res.blob();
}
