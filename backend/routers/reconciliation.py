# backend/routers/reconciliation.py
import io
import datetime
import pandas as pd
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from utils.file_utils import load_csv_bytes, df_to_xlsx_bytes

router = APIRouter()

@router.post("/ship-confirmation-reconciliation")
async def reconcile(
    shipment_history: UploadFile = File(..., description="Shipment_History___Total-*.csv"),
    edib2bi: UploadFile = File(..., description="EDIB2BiReportV2*.csv"),
    edi940: UploadFile = File(..., description="EDI940Report_withCostV2.0*.csv"),
):
    # Load data
    df1 = load_csv_bytes(await shipment_history.read())
    df2 = load_csv_bytes(await edib2bi.read())
    df3 = load_csv_bytes(await edi940.read())

    for df in [df1, df2, df3]:
        df.columns = df.columns.astype(str).str.strip()

    # Check required columns
    required = [
        ("Shipment_History___Total", df1, "Pickticket"),
        ("EDIB2BiReportV2", df2, "AXReferenceID"),
        ("EDI940Report_withCostV2.0", df3, "PickRoute"),
    ]
    for name, df, col in required:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Missing column '{col}' in {name}.")

    # Merge and clean
    merged_df = pd.merge(df1, df2, how="left", left_on="Pickticket", right_on="AXReferenceID")
    merged_df.columns = merged_df.columns.str.strip()

    merged_df = merged_df[
        [c for c in [
            "Warehouse","Pickticket","Order","Drop Date","Ship Date","Ship To",
            "Ship State","Zip Code","Customer PO","Ship Via","Load ID",
            "Weight","SKU","Units","Price","Size Type","Size","Product Type",
            "InvoiceNumber","StatusSummary","ERRORDESCRIPTION"
        ] if c in merged_df.columns]
    ]

    final_df = pd.merge(merged_df, df3, how="left", left_on="Pickticket", right_on="PickRoute")

    final_df = final_df.rename(columns={
        "InvoiceNumber": "Received in EDI?",
        "StatusSummary": "EDI Processing Status",
        "ERRORDESCRIPTION": "EDI Message",
        "PickRoute": "Found in AX Data?",
    })

    # Filter logic
    if {"SalesHeaderDocStatus", "EDI Processing Status"} <= set(final_df.columns):
        filtered = final_df[
            (final_df["SalesHeaderDocStatus"] == "Picking List") &
            (final_df["EDI Processing Status"] == "AX Load Failure")
        ]
    else:
        filtered = final_df

    filtered = filtered.drop_duplicates(subset=["Pickticket"], errors="ignore")

    # Return Excel
    data = df_to_xlsx_bytes(filtered)
    filename = f"MISSING_945_{datetime.datetime.now():%m%d%y}.xlsx"
    return StreamingResponse(
        io.BytesIO(data),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
