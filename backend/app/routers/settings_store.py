"""Settings store router – generic JSON settings per user/workspace."""
from typing import Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from psycopg2.extras import Json as PgJson
from app.database import query, query_one

router = APIRouter(prefix="/api/settings", tags=["settings"])


class SettingsIn(BaseModel):
    key: str
    value: Any
    userId: Optional[str] = None
    workspaceId: Optional[str] = None


@router.get("")
def get_settings(key: str, userId: Optional[str] = None, workspaceId: Optional[str] = None):
    sql = "SELECT value FROM settings_store WHERE store_key = %s"
    params = [key]
    if userId:
        sql += " AND user_id = %s"
        params.append(userId)
    else:
        sql += " AND user_id IS NULL"
    if workspaceId:
        sql += " AND workspace_id = %s"
        params.append(workspaceId)
    else:
        sql += " AND workspace_id IS NULL"
    row = query_one(sql, tuple(params))
    return row["value"] if row else None


@router.post("")
def save_settings(body: SettingsIn):
    # SELECT first then INSERT or UPDATE (handles NULL uniqueness)
    sql = "SELECT id FROM settings_store WHERE store_key = %s"
    params = [body.key]
    if body.userId:
        sql += " AND user_id = %s"
        params.append(body.userId)
    else:
        sql += " AND user_id IS NULL"
    if body.workspaceId:
        sql += " AND workspace_id = %s"
        params.append(body.workspaceId)
    else:
        sql += " AND workspace_id IS NULL"

    existing = query_one(sql, tuple(params))
    if existing:
        result = query_one(
            "UPDATE settings_store SET value = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING value",
            (PgJson(body.value), existing["id"]), commit=True,
        )
    else:
        result = query_one(
            "INSERT INTO settings_store (store_key, user_id, workspace_id, value) VALUES (%s, %s, %s, %s) RETURNING value",
            (body.key, body.userId, body.workspaceId, PgJson(body.value)), commit=True,
        )
    return result["value"] if result else None
