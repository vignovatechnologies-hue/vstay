"""Auth router – login, signup, me."""
import time
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.database import query, query_one

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class SignupIn(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    hostelName: str
    password: Optional[str] = "password"
    planId: Optional[str] = None


def _fmt_user(u: dict) -> dict:
    return {
        "id": u["id"],
        "email": u["email"],
        "fullName": u["full_name"],
        "phone": u.get("phone") or "",
        "role": u["role"],
        "workspaceIds": u.get("workspace_ids") or [],
        "createdAt": u["created_at"].isoformat() if hasattr(u.get("created_at"), "isoformat") else str(u.get("created_at", "")),
    }


def _make_session(user: dict, workspace_id: Optional[str]) -> dict:
    return {
        "token": f"tok_{user['id']}_{int(time.time())}",
        "userId": user["id"],
        "workspaceId": workspace_id,
        "issuedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


@router.post("/login")
def login(body: LoginIn):
    user = query_one("SELECT * FROM users WHERE LOWER(email) = LOWER(%s)", (body.email,))
    if not user or body.password != (user.get("password") or "password"):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    ws_ids: list = user.get("workspace_ids") or []
    role = user["role"]
    requires_ws_selection = role == "owner" and len(ws_ids) > 1
    initial_ws = None if (role == "super_admin" or requires_ws_selection) else (ws_ids[0] if ws_ids else None)

    return {
        "session": _make_session(user, initial_ws),
        "user": _fmt_user(user),
        "requiresWorkspaceSelection": requires_ws_selection,
    }


@router.post("/signup")
def signup(body: SignupIn):
    if query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (body.email,)):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    ts = int(time.time() * 1000)
    ws_id = f"pg_{body.hostelName.lower().replace(' ', '_')}_{str(ts)[-4:]}"
    user_id = f"u_owner_{ts}"
    words = body.hostelName.split()
    initials = "".join(w[0] for w in words).upper()[:2] or "PG"

    query(
        "INSERT INTO workspaces (id,name,owner_id,city,address,initials,total_beds,occupied_beds,accent,plan_id) VALUES (%s,%s,%s,%s,%s,%s,50,0,'blue',%s)",
        (ws_id, body.hostelName, user_id, "Bengaluru", "12, MG Road, Bengaluru 560001", initials, body.planId),
        commit=True,
    )
    pwd = body.password or "password"
    query(
        "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids) VALUES (%s,%s,%s,%s,%s,'owner',ARRAY[%s]::TEXT[])",
        (user_id, body.email, pwd, body.fullName, body.phone, ws_id),
        commit=True,
    )

    user = query_one("SELECT * FROM users WHERE id = %s", (user_id,))
    return {
        "session": _make_session(user, ws_id),
        "user": _fmt_user(user),
        "requiresWorkspaceSelection": False,
    }


@router.get("/me/{user_id}")
def me(user_id: str):
    user = query_one("SELECT * FROM users WHERE id = %s", (user_id,))
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    return _fmt_user(user)
