"""
Demo account data reset – runs every 24 hours.

Why this exists:
  Demo accounts (owner@hostly.app, tenant@hostly.app, etc.) are public
  credentials anyone can use to explore the app. Without periodic cleanup,
  visitors accumulate test data and the demo becomes unusable. Worse, users
  could treat the demo as a free product, never paying.

What it does every 24 hours:
  1. Deletes ALL non-seed rows created during the demo session for every
     demo workspace (pg_greenhaven, pg_skyline, pg_meridian, pg_lotus).
  2. Re-inserts the original seed data so the next visitor gets a clean,
     realistic experience.
  3. Resets all demo user passwords back to 'password' in case anyone changed them.
  4. Logs the reset timestamp to the demo_reset_log table.
"""
import logging
from datetime import datetime, timezone

from app.database import query, query_one

log = logging.getLogger(__name__)

# ── Constants ──────────────────────────────────────────────────────────────────

DEMO_USER_IDS = [
    "u_super_1",
    "u_owner_multi",
    "u_owner_single",
    "u_manager_1",
    "u_reception_1",
    "u_tenant_1",
]

DEMO_WORKSPACE_IDS = [
    "pg_greenhaven",
    "pg_skyline",
    "pg_meridian",
    "pg_lotus",
]

# ── Setup the tracking table ───────────────────────────────────────────────────

def init_reset_log_table():
    """Create the demo_reset_log table if it doesn't exist."""
    query("""
        CREATE TABLE IF NOT EXISTS demo_reset_log (
            id         SERIAL PRIMARY KEY,
            reset_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            details    TEXT
        );
    """, commit=True)


# ── Main reset function ────────────────────────────────────────────────────────

def reset_demo_data():
    """
    Full reset of demo workspace data.
    Called by the scheduler every 24 hours.
    """
    log.info("═══ DEMO RESET STARTED ═══")
    started = datetime.now(timezone.utc)

    import os
    from app.database import DEMO_DB_FILE, init_sqlite_db
    from app.database import (
        _seed_users,
        _seed_workspaces,
        _seed_rooms,
        _seed_tenants,
        _seed_staff,
        _seed_complaints,
        _seed_invoices
    )

    try:
        # Delete the SQLite temporary database file to wipe all demo sessions
        if os.path.exists(DEMO_DB_FILE):
            try:
                os.remove(DEMO_DB_FILE)
                log.info("Temporary SQLite database file deleted successfully.")
            except Exception as ex:
                log.error(f"Failed to remove SQLite temporary file: {ex}")

        # Re-initialize the tables
        init_sqlite_db()
        log.info("Temporary SQLite database tables re-initialized.")

        # Seed the temporary database
        _seed_users()
        _seed_workspaces()
        _seed_rooms()
        _seed_tenants()
        _seed_staff()
        _seed_complaints()
        _seed_invoices()
        
        _log_reset(started)
        log.info("═══ DEMO RESET COMPLETE ═══")
    except Exception as e:
        log.error(f"DEMO RESET FAILED: {e}", exc_info=True)



# ── Step 1 · Clear ────────────────────────────────────────────────────────────

def _clear_demo_data():
    """Delete all rows in feature tables that belong to demo workspaces or demo users."""
    log.info("Clearing demo data...")

    # Tables scoped to workspace_id
    for table in ("tenants", "staff", "rooms", "complaints", "invoices", "announcements"):
        query(
            f"DELETE FROM {table} WHERE workspace_id = ANY(%s)",
            (DEMO_WORKSPACE_IDS,), commit=True,
        )

    # Tables scoped to user_id
    for table in ("vehicles", "documents", "laundry_bookings"):
        query(
            f"DELETE FROM {table} WHERE user_id = ANY(%s)",
            (DEMO_USER_IDS,), commit=True,
        )

    # Settings store – wipe demo user/workspace settings
    query(
        "DELETE FROM settings_store WHERE user_id = ANY(%s)",
        (DEMO_USER_IDS,), commit=True,
    )
    query(
        "DELETE FROM settings_store WHERE workspace_id = ANY(%s)",
        (DEMO_WORKSPACE_IDS,), commit=True,
    )

    log.info("Demo data cleared.")


# ── Step 2 · Reseed ───────────────────────────────────────────────────────────

def _reseed_demo_data():
    """Re-insert all original seed rows for demo workspaces."""
    log.info("Re-seeding demo data...")
    _reseed_rooms()
    _reseed_tenants()
    _reseed_staff()
    _reseed_complaints()
    _reseed_invoices()
    log.info("Demo data re-seeded.")


def _reseed_rooms():
    rows = [
        ("r-101", "pg_greenhaven", "101", "Ground", "Single AC",  "₹ 16,500", "1/1", "occupied"),
        ("r-102", "pg_greenhaven", "102", "Ground", "Double AC",  "₹ 12,000", "2/2", "occupied"),
        ("r-103", "pg_greenhaven", "103", "Ground", "Double AC",  "₹ 12,000", "1/2", "partial"),
        ("r-201", "pg_greenhaven", "201", "1st",    "Triple",     "₹ 9,500",  "3/3", "occupied"),
        ("r-202", "pg_greenhaven", "202", "1st",    "Triple",     "₹ 9,500",  "0/3", "vacant"),
        ("r-203", "pg_greenhaven", "203", "1st",    "Double AC",  "₹ 12,000", "2/2", "occupied"),
        ("r-204", "pg_greenhaven", "204", "2nd",    "Triple AC",  "₹ 11,500", "3/3", "occupied"),
        ("r-205", "pg_greenhaven", "205", "2nd",    "Single",     "₹ 14,000", "0/1", "maintenance"),
        ("r-301", "pg_greenhaven", "301", "3rd",    "Double",     "₹ 10,500", "2/2", "occupied"),
        ("r-302", "pg_greenhaven", "302", "3rd",    "Triple AC",  "₹ 11,500", "1/3", "partial"),
    ]
    for rid, wid, room, floor, rtype, rent, beds, status in rows:
        query(
            "INSERT INTO rooms (id,workspace_id,room,floor,type,rent,beds,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
            (rid, wid, room, floor, rtype, rent, beds, status), commit=True,
        )


def _reseed_tenants():
    rows = [
        ("t-1", "pg_greenhaven", "Arjun Kapoor",  "AK", "204·B", "+91 90000 11122", "arjun@example.com",  "May 2025",  "paid",    "verified"),
        ("t-2", "pg_greenhaven", "Vikram Singh",   "VS", "204·A", "+91 91111 22233", "vikram@example.com", "Jan 2025",  "paid",    "verified"),
        ("t-3", "pg_greenhaven", "Nikhil Rao",     "NR", "204·C", "+91 92222 33344", "nikhil@example.com", "Aug 2025",  "due",     "pending"),
        ("t-4", "pg_greenhaven", "Priya Sharma",   "PS", "201·A", "+91 93333 44455", "priya@example.com",  "Mar 2025",  "paid",    "verified"),
        ("t-5", "pg_greenhaven", "Rahul Menon",    "RM", "101",   "+91 94444 55566", "rahul@example.com",  "Oct 2024",  "overdue", "verified"),
        ("t-6", "pg_greenhaven", "Sneha Iyer",     "SI", "301·A", "+91 95555 66677", "sneha@example.com",  "Jun 2025",  "paid",    "verified"),
    ]
    for tid, wid, name, init, room, phone, email, since, rent, kyc in rows:
        query(
            "INSERT INTO tenants (id,workspace_id,name,initials,room,phone,email,since,rent,kyc) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (tid, wid, name, init, room, phone, email, since, rent, kyc), commit=True,
        )


def _reseed_staff():
    rows = [
        ("s-1", "pg_greenhaven", "Devang Shah",  "DS", "Manager",      "+91 98000 00001", "devang@hostly.app",  "Full day", "active"),
        ("s-2", "pg_greenhaven", "Pooja Nair",   "PN", "Reception",    "+91 98000 00002", "pooja@hostly.app",   "Day",      "active"),
        ("s-3", "pg_greenhaven", "Suresh Kumar", "SK", "Housekeeping", "+91 98000 00003", "suresh@hostly.app",  "Morning",  "active"),
        ("s-4", "pg_greenhaven", "Ravi Menon",   "RM", "Security",     "+91 98000 00004", "ravi@hostly.app",    "Night",    "active"),
        ("s-5", "pg_greenhaven", "Arun Patel",   "AP", "Cook",         "+91 98000 00005", "arun@hostly.app",    "Morning",  "leave"),
    ]
    for sid, wid, name, init, role, phone, email, shift, status in rows:
        query(
            "INSERT INTO staff (id,workspace_id,name,initials,role,phone,email,shift,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (sid, wid, name, init, role, phone, email, shift, status), commit=True,
        )


def _reseed_complaints():
    rows = [
        ("c-1", "pg_greenhaven", "Arjun Kapoor", "204·B", "Plumbing",     "high",   "open",        "Tap leaking in washroom",  "28 Nov", ""),
        ("c-2", "pg_greenhaven", "Priya Sharma", "201·A", "Electrical",   "medium", "in_progress", "Tube light flickering",    "25 Nov", ""),
        ("c-3", "pg_greenhaven", "Vikram Singh", "204·A", "Wi-Fi",        "low",    "resolved",    "Slow internet speed",      "20 Nov", "22 Nov"),
        ("c-4", "pg_greenhaven", "Sneha Iyer",   "301·A", "Housekeeping", "medium", "open",        "Room not cleaned",         "29 Nov", ""),
    ]
    for cid, wid, tenant, room, cat, pri, status, desc, raised, resolved in rows:
        query(
            "INSERT INTO complaints (id,workspace_id,tenant,room,category,priority,status,description,raised_on,resolved_on) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (cid, wid, tenant, room, cat, pri, status, desc, raised, resolved), commit=True,
        )


def _reseed_invoices():
    rows = [
        ("INV-1104", "pg_greenhaven", "Arjun Kapoor", "204·B", "Nov 2026", "₹ 11,500", "05 Nov", "UPI",  "paid"),
        ("INV-1105", "pg_greenhaven", "Vikram Singh", "204·A", "Nov 2026", "₹ 11,500", "03 Nov", "UPI",  "paid"),
        ("INV-1106", "pg_greenhaven", "Nikhil Rao",   "204·C", "Nov 2026", "₹ 11,500", "—",      "—",    "due"),
        ("INV-1107", "pg_greenhaven", "Priya Sharma", "201·A", "Nov 2026", "₹ 9,500",  "06 Nov", "Bank", "paid"),
        ("INV-1108", "pg_greenhaven", "Rahul Menon",  "101",   "Nov 2026", "₹ 16,500", "—",      "—",    "overdue"),
        ("INV-1109", "pg_greenhaven", "Sneha Iyer",   "301·A", "Nov 2026", "₹ 10,500", "04 Nov", "Card", "paid"),
    ]
    for iid, wid, tenant, room, month, amount, date, method, status in rows:
        query(
            "INSERT INTO invoices (id,workspace_id,tenant,room,month,amount,date,method,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (iid, wid, tenant, room, month, amount, date, method, status), commit=True,
        )


# ── Step 3 · Reset passwords ──────────────────────────────────────────────────

def _reset_demo_passwords():
    """Reset demo account passwords back to 'password' in case anyone changed them."""
    query(
        "UPDATE users SET password = 'password' WHERE id = ANY(%s)",
        (DEMO_USER_IDS,), commit=True,
    )
    log.info("Demo passwords reset.")


def _reset_demo_workspaces():
    """Reset demo workspace parameters (accent, plan, subscription_status) back to default."""
    rows = [
        ("pg_greenhaven", 84,  71,  "emerald"),
        ("pg_skyline",    56,  49,  "blue"),
        ("pg_meridian",   120, 98,  "violet"),
        ("pg_lotus",      48,  44,  "rose"),
    ]
    for wid, tot, occ, acc in rows:
        query(
            "UPDATE workspaces SET total_beds = %s, occupied_beds = %s, accent = %s, plan_id = 'yearly', subscription_status = 'active', stripe_subscription_id = NULL, stripe_customer_id = NULL, amount_paid = 9999 WHERE id = %s",
            (tot, occ, acc, wid), commit=True,
        )
    log.info("Demo workspaces reset.")


# ── Step 4 · Log ──────────────────────────────────────────────────────────────

def _log_reset(started: datetime):
    duration_ms = int((datetime.now(timezone.utc) - started).total_seconds() * 1000)
    query(
        "INSERT INTO demo_reset_log (reset_at, details) VALUES (CURRENT_TIMESTAMP, %s)",
        (f"Reset completed in {duration_ms}ms",), commit=True,
    )
    log.info(f"Demo reset logged. Duration: {duration_ms}ms")
