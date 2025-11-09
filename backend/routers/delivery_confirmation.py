# backend/routers/delivery_confirmation.py
import io
import pandas as pd
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse
from utils.file_utils import load_csv_bytes, get_col, df_to_xlsx_bytes

router = APIRouter()

@router.post("/delivery-confirmation")
async def ax_load_failures(
    ax_report: UploadFile = File(..., description="AX D1 CSV (must include 'Pick Number', 'Customer', '1st/2nd Leg SID/SCAC')"),
    edi214: UploadFile = File(..., description="EDI 214 CSV (must include 'SalesOrderNumber1', 'StatusSummary', etc.)"),
):
    ax = load_csv_bytes(await ax_report.read())
    edi = load_csv_bytes(await edi214.read())

    # Column mapping
    ax_pick = get_col(ax, "Pick Number")
    ax_cust = get_col(ax, "Customer")
    ax_leg1_sid  = get_col(ax, "1st Leg SID")
    ax_leg1_scac = get_col(ax, "1st Leg SCAC")
    ax_leg2_sid  = get_col(ax, "2nd Leg SID")
    ax_leg2_scac = get_col(ax, "2nd Leg SCAC")

    edi_so   = get_col(edi, "SalesOrderNumber1")
    edi_stat = get_col(edi, "StatusSummary")
    edi_time = get_col(edi, "TimeIssueOccurred")
    edi_err  = get_col(edi, "ERRORDESCRIPTION")
    edi_loc  = get_col(edi, "EDILocationID1")
    edi_tp   = get_col(edi, "TradingPartnerCode")
    edi_co   = get_col(edi, "AXCompany")

    # Prepare data
    ax_tmp = ax[[ax_pick, ax_cust, ax_leg1_sid, ax_leg1_scac, ax_leg2_sid, ax_leg2_scac]].copy()
    ax_tmp["__key"] = ax_tmp[ax_pick].astype(str).str.strip().str.lower()

    edi_tmp = edi[[edi_so, edi_stat, edi_time, edi_err, edi_loc, edi_tp, edi_co]].copy()
    edi_tmp["__key"] = edi_tmp[edi_so].astype(str).str.strip().str.lower()

    merged = ax_tmp.merge(edi_tmp, on="__key", how="inner")

    failures = merged.loc[merged[edi_stat].astype(str).str.lower().eq("ax load failure")]

    out = pd.DataFrame({
        "PickTicketNumber": failures[ax_pick],
        "Customer": failures[ax_cust],
        "1st Leg SID": failures[ax_leg1_sid],
        "1st Leg SCAC": failures[ax_leg1_scac],
        "2nd Leg SID": failures[ax_leg2_sid],
        "2nd Leg SCAC": failures[ax_leg2_scac],
        "TimeIssueOccurred": failures[edi_time],
        "StatusSummary": failures[edi_stat],
        "ErrorDescription": failures[edi_err],
        "EDILocationID1": failures[edi_loc],
        "TradingPartnerCode": failures[edi_tp],
        "AXCompany": failures[edi_co],
    }).drop_duplicates(ignore_index=True)

    xlsx = df_to_xlsx_bytes(out, sheet_name="AX_Load_Failures")
    return StreamingResponse(
        io.BytesIO(xlsx),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="AX_Load_Failures.xlsx"'},
    )
