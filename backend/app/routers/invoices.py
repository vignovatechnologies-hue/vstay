"""Invoices (payments) router – mark paid, remind, export."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/invoices", tags=["invoices"])


class InvoiceIn(BaseModel):
    workspace_id: str
    tenant: Optional[str] = ""
    room: Optional[str] = ""
    month: Optional[str] = ""
    amount: Optional[str] = ""
    date: Optional[str] = "—"
    method: Optional[str] = "—"
    status: Optional[str] = "due"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "tenant": r.get("tenant", ""),
        "room": r.get("room", ""),
        "month": r.get("month", ""),
        "amount": r.get("amount", ""),
        "date": r.get("date", "—"),
        "method": r.get("method", "—"),
        "status": r.get("status", "due"),
    }


@router.get("")
def list_invoices(workspaceId: Optional[str] = None, tenantName: Optional[str] = None):
    if tenantName:
        rows = query(
            "SELECT * FROM invoices WHERE LOWER(tenant) = LOWER(%s) ORDER BY created_at DESC",
            (tenantName,), fetch=True,
        )
        if not rows:
            # Seed default invoices for this tenant
            defaults = [
                ("INV-DEC", "December 2026", "₹ 11,500", "—", "—", "due"),
                ("INV-AUG", "August 2026", "₹ 11,500", "05 Aug 2026", "UPI · HDFC", "paid"),
                ("INV-JUL", "July 2026", "₹ 11,500", "07 Jul 2026", "Cash", "paid"),
            ]
            for iid, month, amount, date, method, status in defaults:
                query(
                    "INSERT INTO invoices (id,workspace_id,tenant,room,month,amount,date,method,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                    (iid, "pg_greenhaven", tenantName, "302", month, amount, date, method, status),
                    commit=True,
                )
            rows = query(
                "SELECT * FROM invoices WHERE LOWER(tenant) = LOWER(%s) ORDER BY created_at DESC",
                (tenantName,), fetch=True,
            )
    elif workspaceId:
        rows = query(
            "SELECT * FROM invoices WHERE workspace_id = %s ORDER BY created_at DESC",
            (workspaceId,), fetch=True,
        )
        if not rows:
            sample_invoices = [
                ("INV-1104", "Arjun Kapoor",  "204·B", "Nov 2026", "₹ 11,500", "05 Nov", "UPI",  "paid"),
                ("INV-1105", "Vikram Singh",  "204·A", "Nov 2026", "₹ 11,500", "03 Nov", "UPI",  "paid"),
                ("INV-1106", "Nikhil Rao",    "204·C", "Nov 2026", "₹ 11,500", "—",      "—",    "due"),
                ("INV-1107", "Priya Sharma",  "201·A", "Nov 2026", "₹ 9,500",  "06 Nov", "Bank", "paid"),
                ("INV-1108", "Rahul Menon",   "101",   "Nov 2026", "₹ 16,500", "—",      "—",    "overdue"),
                ("INV-1109", "Sneha Iyer",    "301·A", "Nov 2026", "₹ 10,500", "04 Nov", "Card", "paid"),
            ]
            for iid, tenant, room, month, amount, date, method, status in sample_invoices:
                full_id = f"{iid}-{uuid.uuid4().hex[:4]}"
                query(
                    "INSERT INTO invoices (id,workspace_id,tenant,room,month,amount,date,method,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                    (full_id, workspaceId, tenant, room, month, amount, date, method, status),
                    commit=True,
                )
            rows = query(
                "SELECT * FROM invoices WHERE workspace_id = %s ORDER BY created_at DESC",
                (workspaceId,), fetch=True,
            )
    else:
        rows = []
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_invoice(body: InvoiceIn):
    iid = f"INV-{uuid.uuid4().hex[:6].upper()}"
    query(
        "INSERT INTO invoices (id,workspace_id,tenant,room,month,amount,date,method,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (iid, body.workspace_id, body.tenant, body.room, body.month, body.amount, body.date, body.method, body.status),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM invoices WHERE id = %s", (iid,)))


@router.patch("/{invoice_id}")
def update_invoice(invoice_id: str, body: dict):
    r = query_one("SELECT * FROM invoices WHERE id = %s", (invoice_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    allowed = {"tenant", "room", "month", "amount", "date", "method", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [invoice_id]
    query(f"UPDATE invoices SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM invoices WHERE id = %s", (invoice_id,)))


@router.delete("/{invoice_id}", status_code=204)
def delete_invoice(invoice_id: str):
    query("DELETE FROM invoices WHERE id = %s", (invoice_id,), commit=True)
