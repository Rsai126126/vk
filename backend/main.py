from fastapi import FastAPI
from routers import reconciliation, delivery_confirmation, no_sonum
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Missing 945 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reconciliation.router, prefix="/reconciliation", tags=["Reconciliation"])
app.include_router(delivery_confirmation.router, prefix="/delivery", tags=["Delivery Confirmation"])
app.include_router(no_sonum.router, prefix="/no-sonum", tags=["NO_SONUM"])

@app.get("/")
def home():
    return {"message": "✅ API is live and working!"}

