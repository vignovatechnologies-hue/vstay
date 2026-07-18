"""
Database connection pool and query helpers for the Hostly backend.
"""
import os
import logging
from contextlib import contextmanager

import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor, Json
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

pool: ThreadedConnectionPool = ThreadedConnectionPool(minconn=1, maxconn=20, dsn=DATABASE_URL)


@contextmanager
def get_conn():
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)


@contextmanager
def cursor(commit: bool = False):
    with get_conn() as conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cur
            if commit:
                conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cur.close()


def query(sql: str, params=None, *, fetch: bool = False, commit: bool = False):
    with cursor(commit=commit) as cur:
        cur.execute(sql, params or ())
        if fetch:
            return cur.fetchall()
        return None


def query_one(sql: str, params=None, *, commit: bool = False):
    with cursor(commit=commit) as cur:
        cur.execute(sql, params or ())
        return cur.fetchone()


def init_db():
    """Create tables and seed initial data if they don't exist."""
    logging.info("Initializing database schema...")

    # ── Core tables ──────────────────────────────────────────────
    query("""
        CREATE TABLE IF NOT EXISTS users (
            id          VARCHAR(255) PRIMARY KEY,
            email       VARCHAR(255) UNIQUE NOT NULL,
            password    VARCHAR(255) NOT NULL DEFAULT 'password',
            full_name   VARCHAR(255) NOT NULL,
            phone       VARCHAR(255),
            role        VARCHAR(50)  NOT NULL,
            workspace_ids TEXT[] DEFAULT '{}',
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS workspaces (
            id            VARCHAR(255) PRIMARY KEY,
            name          VARCHAR(255) NOT NULL,
            owner_id      VARCHAR(255) NOT NULL,
            city          VARCHAR(255),
            address       TEXT,
            initials      VARCHAR(10),
            total_beds    INTEGER DEFAULT 50,
            occupied_beds INTEGER DEFAULT 0,
            accent        VARCHAR(50) DEFAULT 'blue',
            plan_id       VARCHAR(50),
            subscription_status VARCHAR(50) DEFAULT 'unpaid',
            stripe_subscription_id VARCHAR(255),
            stripe_customer_id VARCHAR(255),
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'unpaid';", commit=True)
    query("ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);", commit=True)
    query("ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);", commit=True)

    # ── Feature tables ────────────────────────────────────────────
    query("""
        CREATE TABLE IF NOT EXISTS rooms (
            id           VARCHAR(255) PRIMARY KEY,
            workspace_id VARCHAR(255) NOT NULL,
            room         VARCHAR(50)  NOT NULL,
            floor        VARCHAR(50),
            type         VARCHAR(100),
            rent         VARCHAR(50),
            beds         VARCHAR(20),
            status       VARCHAR(50) DEFAULT 'vacant',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS tenants (
            id           VARCHAR(255) PRIMARY KEY,
            workspace_id VARCHAR(255) NOT NULL,
            name         VARCHAR(255) NOT NULL,
            initials     VARCHAR(10),
            room         VARCHAR(50),
            phone        VARCHAR(100),
            email        VARCHAR(255),
            since        VARCHAR(50),
            rent         VARCHAR(50) DEFAULT 'due',
            kyc          VARCHAR(50) DEFAULT 'pending',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS staff (
            id           VARCHAR(255) PRIMARY KEY,
            workspace_id VARCHAR(255) NOT NULL,
            name         VARCHAR(255) NOT NULL,
            initials     VARCHAR(10),
            role         VARCHAR(100),
            phone        VARCHAR(100),
            email        VARCHAR(255),
            shift        VARCHAR(50),
            status       VARCHAR(50) DEFAULT 'active',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS complaints (
            id           VARCHAR(255) PRIMARY KEY,
            workspace_id VARCHAR(255) NOT NULL,
            tenant       VARCHAR(255),
            room         VARCHAR(50),
            category     VARCHAR(100),
            priority     VARCHAR(50),
            status       VARCHAR(50) DEFAULT 'open',
            description  TEXT,
            raised_on    VARCHAR(50),
            resolved_on  VARCHAR(50),
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS invoices (
            id           VARCHAR(255) PRIMARY KEY,
            workspace_id VARCHAR(255) NOT NULL,
            tenant       VARCHAR(255),
            room         VARCHAR(50),
            month        VARCHAR(50),
            amount       VARCHAR(50),
            date         VARCHAR(50),
            method       VARCHAR(50),
            status       VARCHAR(50) DEFAULT 'due',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS announcements (
            id           VARCHAR(255) PRIMARY KEY,
            workspace_id VARCHAR(255),
            title        VARCHAR(255),
            body         TEXT,
            audience     VARCHAR(100),
            pinned       BOOLEAN DEFAULT FALSE,
            author       VARCHAR(255),
            status       VARCHAR(100),
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)
    query("ALTER TABLE announcements ADD COLUMN IF NOT EXISTS author VARCHAR(255);", commit=True)
    query("ALTER TABLE announcements ADD COLUMN IF NOT EXISTS status VARCHAR(100);", commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS vehicles (
            id               VARCHAR(255) PRIMARY KEY,
            user_id          VARCHAR(255) NOT NULL,
            workspace_id     VARCHAR(255),
            type             VARCHAR(50),
            reg_number       VARCHAR(100),
            make             VARCHAR(100),
            model            VARCHAR(100),
            color            VARCHAR(100),
            parking_required VARCHAR(10),
            parking_slot     VARCHAR(50),
            status           VARCHAR(50) DEFAULT 'Pending',
            notes            TEXT,
            added_at         VARCHAR(50),
            created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS documents (
            id           VARCHAR(255) PRIMARY KEY,
            user_id      VARCHAR(255) NOT NULL,
            workspace_id VARCHAR(255),
            name         VARCHAR(255),
            type         VARCHAR(100),
            size         VARCHAR(50),
            uploaded     VARCHAR(50),
            status       VARCHAR(50) DEFAULT 'pending',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS laundry_bookings (
            id           VARCHAR(255) PRIMARY KEY,
            user_id      VARCHAR(255) NOT NULL,
            workspace_id VARCHAR(255),
            date         VARCHAR(50),
            slot         VARCHAR(100),
            service      VARCHAR(100),
            machine      VARCHAR(50),
            status       VARCHAR(50) DEFAULT 'upcoming',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    query("""
        CREATE TABLE IF NOT EXISTS tenant_payments (
            id           VARCHAR(255) PRIMARY KEY,
            user_id      VARCHAR(255) NOT NULL,
            workspace_id VARCHAR(255),
            desc_text    VARCHAR(255),
            amount       VARCHAR(50),
            date         VARCHAR(50),
            method       VARCHAR(50),
            status       VARCHAR(50) DEFAULT 'due',
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)

    # Generic JSON settings store (for owner/SA settings etc.)
    query("""
        CREATE TABLE IF NOT EXISTS settings_store (
            id           SERIAL PRIMARY KEY,
            store_key    VARCHAR(255) NOT NULL,
            user_id      VARCHAR(255),
            workspace_id VARCHAR(255),
            value        JSONB NOT NULL,
            updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """, commit=True)
    # Partial unique indexes to handle NULLs correctly
    query("""
        CREATE UNIQUE INDEX IF NOT EXISTS uq_settings_all
        ON settings_store (store_key, user_id, workspace_id)
        WHERE user_id IS NOT NULL AND workspace_id IS NOT NULL;
    """, commit=True)
    query("""
        CREATE UNIQUE INDEX IF NOT EXISTS uq_settings_user_only
        ON settings_store (store_key, user_id)
        WHERE user_id IS NOT NULL AND workspace_id IS NULL;
    """, commit=True)
    query("""
        CREATE UNIQUE INDEX IF NOT EXISTS uq_settings_ws_only
        ON settings_store (store_key, workspace_id)
        WHERE user_id IS NULL AND workspace_id IS NOT NULL;
    """, commit=True)
    query("""
        CREATE UNIQUE INDEX IF NOT EXISTS uq_settings_global
        ON settings_store (store_key)
        WHERE user_id IS NULL AND workspace_id IS NULL;
    """, commit=True)

    # ── Seed data ─────────────────────────────────────────────────
    _seed_users()
    _seed_workspaces()
    _seed_rooms()
    _seed_tenants()
    _seed_staff()
    _seed_complaints()
    _seed_invoices()

    logging.info("Database initialization complete.")


# ── Seed helpers ──────────────────────────────────────────────────────────────

def _seed_users():
    count = query_one("SELECT COUNT(*) FROM users")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding users...")
    rows = [
        ("u_super_1",      "super@hostly.app",     "Aanya Mehta",  "",                   "super_admin", []),
        ("u_owner_multi",  "owner@hostly.app",      "Rohan Verma",  "+91 98200 12345",    "owner",       ["pg_greenhaven", "pg_skyline", "pg_meridian"]),
        ("u_owner_single", "single@hostly.app",     "Kavya Iyer",   "+91 98765 22110",    "owner",       ["pg_lotus"]),
        ("u_manager_1",    "manager@hostly.app",    "Devang Shah",  "",                   "manager",     ["pg_greenhaven"]),
        ("u_reception_1",  "reception@hostly.app",  "Pooja Nair",   "",                   "reception",   ["pg_greenhaven"]),
        ("u_tenant_1",     "tenant@hostly.app",     "Arjun Kapoor", "+91 90000 11122",    "tenant",      ["pg_greenhaven"]),
    ]
    for uid, email, name, phone, role, ws_ids in rows:
        query(
            "INSERT INTO users (id, email, password, full_name, phone, role, workspace_ids) VALUES (%s,%s,'password',%s,%s,%s,%s)",
            (uid, email, name, phone, role, ws_ids), commit=True,
        )


def _seed_workspaces():
    count = query_one("SELECT COUNT(*) FROM workspaces")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding workspaces...")
    rows = [
        ("pg_greenhaven", "Greenhaven Residency",  "u_owner_multi",  "Bengaluru",  "12, 5th Cross, Indiranagar, Bengaluru 560038",  "GR", 84,  71,  "emerald"),
        ("pg_skyline",    "Skyline Stays",          "u_owner_multi",  "Pune",       "Sector 14, Magarpatta, Pune 411028",            "SS", 56,  49,  "blue"),
        ("pg_meridian",   "Meridian Co-Living",     "u_owner_multi",  "Hyderabad",  "Plot 18, HITEC City, Hyderabad 500081",         "MC", 120, 98,  "violet"),
        ("pg_lotus",      "Lotus Ladies PG",        "u_owner_single", "Mumbai",     "21, Linking Road, Bandra West, Mumbai 400050", "LP", 48,  44,  "rose"),
    ]
    for wid, name, oid, city, addr, init, tot, occ, acc in rows:
        query(
            "INSERT INTO workspaces (id,name,owner_id,city,address,initials,total_beds,occupied_beds,accent,plan_id,subscription_status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,'yearly','active')",
            (wid, name, oid, city, addr, init, tot, occ, acc), commit=True,
        )


def _seed_rooms():
    count = query_one("SELECT COUNT(*) FROM rooms")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding rooms...")
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


def _seed_tenants():
    count = query_one("SELECT COUNT(*) FROM tenants")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding tenants...")
    rows = [
        ("t-1", "pg_greenhaven", "Arjun Kapoor",   "AK", "204·B", "+91 90000 11122", "arjun@example.com",  "May 2025",  "paid",    "verified"),
        ("t-2", "pg_greenhaven", "Vikram Singh",    "VS", "204·A", "+91 91111 22233", "vikram@example.com", "Jan 2025",  "paid",    "verified"),
        ("t-3", "pg_greenhaven", "Nikhil Rao",      "NR", "204·C", "+91 92222 33344", "nikhil@example.com", "Aug 2025",  "due",     "pending"),
        ("t-4", "pg_greenhaven", "Priya Sharma",    "PS", "201·A", "+91 93333 44455", "priya@example.com",  "Mar 2025",  "paid",    "verified"),
        ("t-5", "pg_greenhaven", "Rahul Menon",     "RM", "101",   "+91 94444 55566", "rahul@example.com",  "Oct 2024",  "overdue", "verified"),
        ("t-6", "pg_greenhaven", "Sneha Iyer",      "SI", "301·A", "+91 95555 66677", "sneha@example.com",  "Jun 2025",  "paid",    "verified"),
    ]
    for tid, wid, name, init, room, phone, email, since, rent, kyc in rows:
        query(
            "INSERT INTO tenants (id,workspace_id,name,initials,room,phone,email,since,rent,kyc) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (tid, wid, name, init, room, phone, email, since, rent, kyc), commit=True,
        )


def _seed_staff():
    count = query_one("SELECT COUNT(*) FROM staff")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding staff...")
    rows = [
        ("s-1", "pg_greenhaven", "Devang Shah",  "DS", "Manager",      "+91 98000 00001", "devang@hostly.app",   "Full day", "active"),
        ("s-2", "pg_greenhaven", "Pooja Nair",   "PN", "Reception",    "+91 98000 00002", "pooja@hostly.app",    "Day",      "active"),
        ("s-3", "pg_greenhaven", "Suresh Kumar", "SK", "Housekeeping", "+91 98000 00003", "suresh@hostly.app",   "Morning",  "active"),
        ("s-4", "pg_greenhaven", "Ravi Menon",   "RM", "Security",     "+91 98000 00004", "ravi@hostly.app",     "Night",    "active"),
        ("s-5", "pg_greenhaven", "Arun Patel",   "AP", "Cook",         "+91 98000 00005", "arun@hostly.app",     "Morning",  "leave"),
    ]
    for sid, wid, name, init, role, phone, email, shift, status in rows:
        query(
            "INSERT INTO staff (id,workspace_id,name,initials,role,phone,email,shift,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (sid, wid, name, init, role, phone, email, shift, status), commit=True,
        )


def _seed_complaints():
    count = query_one("SELECT COUNT(*) FROM complaints")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding complaints...")
    rows = [
        ("c-1", "pg_greenhaven", "Arjun Kapoor",  "204·B", "Plumbing",    "high",   "open",     "Tap leaking in washroom", "28 Nov", ""),
        ("c-2", "pg_greenhaven", "Priya Sharma",  "201·A", "Electrical",  "medium", "in_progress", "Tube light flickering",  "25 Nov", ""),
        ("c-3", "pg_greenhaven", "Vikram Singh",  "204·A", "Wi-Fi",       "low",    "resolved", "Slow internet speed",     "20 Nov", "22 Nov"),
        ("c-4", "pg_greenhaven", "Sneha Iyer",    "301·A", "Housekeeping","medium", "open",     "Room not cleaned",        "29 Nov", ""),
    ]
    for cid, wid, tenant, room, cat, pri, status, desc, raised, resolved in rows:
        query(
            "INSERT INTO complaints (id,workspace_id,tenant,room,category,priority,status,description,raised_on,resolved_on) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (cid, wid, tenant, room, cat, pri, status, desc, raised, resolved), commit=True,
        )


def _seed_invoices():
    count = query_one("SELECT COUNT(*) FROM invoices")
    if count and int(count["count"]) > 0:
        return
    logging.info("Seeding invoices...")
    rows = [
        ("INV-1104", "pg_greenhaven", "Arjun Kapoor",  "204·B", "Nov 2026", "₹ 11,500", "05 Nov", "UPI",  "paid"),
        ("INV-1105", "pg_greenhaven", "Vikram Singh",  "204·A", "Nov 2026", "₹ 11,500", "03 Nov", "UPI",  "paid"),
        ("INV-1106", "pg_greenhaven", "Nikhil Rao",    "204·C", "Nov 2026", "₹ 11,500", "—",      "—",    "due"),
        ("INV-1107", "pg_greenhaven", "Priya Sharma",  "201·A", "Nov 2026", "₹ 9,500",  "06 Nov", "Bank", "paid"),
        ("INV-1108", "pg_greenhaven", "Rahul Menon",   "101",   "Nov 2026", "₹ 16,500", "—",      "—",    "overdue"),
        ("INV-1109", "pg_greenhaven", "Sneha Iyer",    "301·A", "Nov 2026", "₹ 10,500", "04 Nov", "Card", "paid"),
    ]
    for iid, wid, tenant, room, month, amount, date, method, status in rows:
        query(
            "INSERT INTO invoices (id,workspace_id,tenant,room,month,amount,date,method,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (iid, wid, tenant, room, month, amount, date, method, status), commit=True,
        )
