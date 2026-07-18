"""Workspaces router."""
from fastapi import APIRouter, HTTPException, status
from app.database import query, query_one

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "ownerId": r["owner_id"],
        "city": r.get("city"),
        "address": r.get("address"),
        "initials": r.get("initials"),
        "totalBeds": r["total_beds"],
        "occupiedBeds": r["occupied_beds"],
        "accent": r.get("accent", "blue"),
        "planId": r.get("plan_id"),
        "subscriptionStatus": r.get("subscription_status", "unpaid"),
        "stripeSubscriptionId": r.get("stripe_subscription_id"),
        "stripeCustomerId": r.get("stripe_customer_id"),
        "createdAt": r["created_at"].isoformat() if hasattr(r.get("created_at"), "isoformat") else str(r.get("created_at", "")),
    }


@router.get("")
def list_workspaces(userId: str):
    user = query_one("SELECT * FROM users WHERE id = %s", (userId,))
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

    if user["role"] == "super_admin":
        rows = query("SELECT * FROM workspaces ORDER BY created_at DESC", fetch=True)
    else:
        ws_ids = user.get("workspace_ids") or []
        if not ws_ids:
            return []
        rows = query("SELECT * FROM workspaces WHERE id = ANY(%s) ORDER BY created_at DESC", (ws_ids,), fetch=True)

    return [_fmt(r) for r in (rows or [])]


@router.get("/{workspace_id}")
def get_workspace(workspace_id: str):
    r = query_one("SELECT * FROM workspaces WHERE id = %s", (workspace_id,))
    return _fmt(r) if r else None
