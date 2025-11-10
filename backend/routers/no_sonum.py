# backend/routers/no_sonum.py
import io
import datetime
import pandas as pd
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from utils.file_utils import load_csv_bytes, df_to_xlsx_bytes

router = APIRouter()

@router.post("/analyze")
async def no_sonum_analysis(
    file1: UploadFile = File(..., description="Primary dataset for NO_SONUM analysis"),
    file2: UploadFile = File(..., description="Secondary dataset for comparison"),
    file3: UploadFile = File(..., description="Additional reference data"),
):
    df1 = load_csv_bytes(await file1.read())
    df2 = load_csv_bytes(await file2.read())
    df3 = load_csv_bytes(await file3.read())

    for df in [df1, df2, df3]:
        df.columns = df.columns.astype(str).str.strip()

    result_df = pd.DataFrame({
        'Analysis': ['NO_SONUM processing'],
        'File1_Rows': [len(df1)],
        'File2_Rows': [len(df2)],
        'File3_Rows': [len(df3)],
        'Status': ['Placeholder - Implement analysis logic'],
    })

    data = df_to_xlsx_bytes(result_df, sheet_name="NO_SONUM_Analysis")
    filename = f"NO_SONUM_Analysis_{datetime.datetime.now():%m%d%y}.xlsx"

    return StreamingResponse(
        io.BytesIO(data),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
