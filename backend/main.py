"""
Vstay FastAPI backend entry point.
"""
import logging
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from app.database import init_db, query, query_one
from app.demo_reset import init_reset_log_table, reset_demo_data
from app.routers import (
    auth,
    workspaces,
    rooms,
    tenants,
    staff,
    complaints,
    invoices,
    announcements,
    vehicles,
    documents,
    laundry,
    settings_store,
    billing,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

app = FastAPI(
    title="Vstay API",
    description="Backend for Vstay PG Management Platform",
    version="2.0.0",
)

# CORS – allow the Vite dev server (any origin in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(workspaces.router)
app.include_router(rooms.router)
app.include_router(tenants.router)
app.include_router(staff.router)
app.include_router(complaints.router)
app.include_router(invoices.router)
app.include_router(announcements.router)
app.include_router(vehicles.router)
app.include_router(documents.router)
app.include_router(laundry.router)
app.include_router(settings_store.router)
app.include_router(billing.router)

# ── Background scheduler ───────────────────────────────────────────────────────
scheduler = BackgroundScheduler(timezone="UTC")


@app.on_event("startup")
def startup():
    # 1. Create/migrate tables and seed initial data
    init_db()

    # 2. Ensure the reset log table exists
    init_reset_log_table()

    # 3. Schedule demo data reset every 24 hours (runs at midnight UTC)
    scheduler.add_job(
        reset_demo_data,
        trigger="cron",
        hour=0,
        minute=0,
        id="demo_reset",
        replace_existing=True,
    )
    scheduler.start()
    logging.info("Demo reset scheduler started – runs daily at 00:00 UTC.")


@app.on_event("shutdown")
def shutdown():
    scheduler.shutdown(wait=False)


# ── Health & admin endpoints ───────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "vstay-backend"}


@app.get("/demo/status")
def demo_status():
    """Return when the demo was last reset and when the next reset is scheduled."""
    last = query_one(
        "SELECT reset_at, details FROM demo_reset_log ORDER BY reset_at DESC LIMIT 1"
    )
    job = scheduler.get_job("demo_reset")
    next_run = job.next_run_time.isoformat() if job and job.next_run_time else None

    return {
        "last_reset": last["reset_at"].isoformat() if last else None,
        "last_reset_details": last["details"] if last else None,
        "next_reset_utc": next_run,
    }


@app.post("/demo/reset")
def manual_demo_reset(secret: str):
    """
    Manually trigger a demo reset (for admin use only).
    Requires the DEMO_RESET_SECRET query param to match the env variable.
    """
    import os
    expected = os.getenv("DEMO_RESET_SECRET", "vstay-demo-reset-2026")
    if secret != expected:
        raise HTTPException(status_code=403, detail="Invalid secret.")
    reset_demo_data()
    return {"status": "ok", "message": "Demo data has been reset."}
