# backend/utils/file_utils.py
import io
import pandas as pd
from fastapi import HTTPException

def load_csv_bytes(b: bytes) -> pd.DataFrame:
    """Read CSV bytes, trying multiple encodings for compatibility."""
    last_err = None
    for enc in ("utf-8", "utf-8-sig", "utf-16", "latin1"):
        try:
            return pd.read_csv(io.BytesIO(b), encoding=enc, low_memory=False)
        except Exception as e:
            last_err = e
    try:
        return pd.read_csv(io.BytesIO(b), engine="python", sep=None, low_memory=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CSV read error: {e or last_err}")

def df_to_xlsx_bytes(df: pd.DataFrame, sheet_name: str = "Sheet1") -> bytes:
    """Convert a DataFrame to Excel bytes."""
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name)
    buf.seek(0)
    return buf.getvalue()

def get_col(df: pd.DataFrame, name: str) -> str:
    """Find column by name (case-insensitive)."""
    cols = {c.lower().strip(): c for c in df.columns}
    key = name.lower().strip()
    if key not in cols:
        raise HTTPException(status_code=400, detail=f"Missing column '{name}'. Available: {list(df.columns)}")
    return cols[key]
