"""Documents router – tenant document uploads and status."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database import query, query_one

router = APIRouter(prefix="/api/documents", tags=["documents"])


class DocumentIn(BaseModel):
    user_id: str
    workspace_id: Optional[str] = None
    name: Optional[str] = ""
    type: Optional[str] = ""
    size: Optional[str] = ""
    uploaded: Optional[str] = ""
    status: Optional[str] = "pending"


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r.get("name", ""),
        "type": r.get("type", ""),
        "size": r.get("size", ""),
        "uploaded": r.get("uploaded", ""),
        "status": r.get("status", "pending"),
    }


@router.get("")
def list_documents(userId: str):
    rows = query("SELECT * FROM documents WHERE user_id = %s ORDER BY created_at DESC", (userId,), fetch=True)
    if not rows:
        # Seed default required documents for new user
        defaults = [
            ("Rental Agreement.pdf", "Agreement", "412 KB", "May 09, 2025", "verified"),
            ("Aadhaar Card.pdf", "ID Proof", "220 KB", "May 09, 2025", "verified"),
            ("Employment Letter.pdf", "Address Proof", "180 KB", "May 10, 2025", "verified"),
            ("Police Verification", "Verification", "", "", "missing"),
        ]
        for name, dtype, size, uploaded, status in defaults:
            did = f"d-{uuid.uuid4().hex[:8]}"
            query(
                "INSERT INTO documents (id,user_id,workspace_id,name,type,size,uploaded,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
                (did, userId, "pg_greenhaven", name, dtype, size, uploaded, status),
                commit=True,
            )
        rows = query("SELECT * FROM documents WHERE user_id = %s ORDER BY created_at DESC", (userId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_document(body: DocumentIn):
    did = f"d-{uuid.uuid4().hex[:8]}"
    query(
        "INSERT INTO documents (id,user_id,workspace_id,name,type,size,uploaded,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
        (did, body.user_id, body.workspace_id, body.name, body.type, body.size, body.uploaded, body.status),
        commit=True,
    )
    return _fmt(query_one("SELECT * FROM documents WHERE id = %s", (did,)))


@router.patch("/{doc_id}")
def update_document(doc_id: str, body: dict):
    r = query_one("SELECT * FROM documents WHERE id = %s", (doc_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Document not found")
    allowed = {"name", "type", "size", "uploaded", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [doc_id]
    query(f"UPDATE documents SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM documents WHERE id = %s", (doc_id,)))


@router.delete("/{doc_id}", status_code=204)
def delete_document(doc_id: str):
    query("DELETE FROM documents WHERE id = %s", (doc_id,), commit=True)
