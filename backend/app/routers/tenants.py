"""Tenants router – CRUD for workspace tenants."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from app.database import query, query_one
from app.services.email import send_tenant_onboarding_email

router = APIRouter(prefix="/api/tenants", tags=["tenants"])


class TenantIn(BaseModel):
    workspace_id: str
    name: str
    room: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    since: Optional[str] = ""
    rent: Optional[str] = "due"
    kyc: Optional[str] = "pending"


class EmailDirectIn(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    login_url: Optional[str] = ""
    workspace_id: Optional[str] = ""


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "initials": r.get("initials", ""),
        "room": r.get("room", ""),
        "phone": r.get("phone", ""),
        "email": r.get("email", ""),
        "since": r.get("since", ""),
        "rent": r.get("rent", "due"),
        "kyc": r.get("kyc", "pending"),
    }


@router.get("")
def list_tenants(workspaceId: str):
    rows = query("SELECT * FROM tenants WHERE workspace_id = %s ORDER BY created_at DESC", (workspaceId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_tenant(body: TenantIn, background_tasks: BackgroundTasks):
    tid = f"t-{uuid.uuid4().hex[:8]}"
    parts = body.name.strip().split()
    initials = ((parts[0][0] if parts else "") + (parts[1][0] if len(parts) > 1 else "")).upper() or "T"
    query(
        "INSERT INTO tenants (id,workspace_id,name,initials,room,phone,email,since,rent,kyc) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (tid, body.workspace_id, body.name, initials, body.room, body.phone, body.email, body.since, body.rent, body.kyc),
        commit=True,
    )

    # Auto-create user credentials for tenant login
    if body.email and body.email != "—":
        email_lower = body.email.strip().lower()
        clean_name = body.name.strip().replace(" ", "").lower()
        first_4_name = clean_name[:4] if clean_name else "user"
        clean_phone = "".join(c for c in (body.phone or "") if c.isdigit())
        last_2_phone = clean_phone[-2:] if len(clean_phone) >= 2 else (clean_phone or "00")
        last_4_phone = clean_phone[-4:] if len(clean_phone) >= 4 else (clean_phone or "0000")

        generated_username = f"{clean_name}{last_2_phone}"
        generated_password = f"{first_4_name}{last_4_phone}"

        existing_tenant_user = query_one(
            "SELECT id FROM users WHERE (LOWER(email) = LOWER(%s) AND role = 'tenant') OR (username IS NOT NULL AND LOWER(username) = LOWER(%s))",
            (email_lower, generated_username),
        )
        if not existing_tenant_user:
            u_id = f"u_tenant_{uuid.uuid4().hex[:8]}"
            user_email = email_lower
            if query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email_lower,)):
                user_email = f"{generated_username}@tenant.vstay.app"
            query(
                "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids,username) VALUES (%s,%s,%s,%s,%s,'tenant',ARRAY[%s]::TEXT[],%s)",
                (u_id, user_email, generated_password, body.name, body.phone, body.workspace_id, generated_username),
                commit=True,
            )
        else:
            query(
                "UPDATE users SET password = %s, phone = %s, full_name = %s, username = %s WHERE id = %s",
                (generated_password, body.phone, body.name, generated_username, existing_tenant_user["id"]),
                commit=True,
            )

        background_tasks.add_task(
            send_tenant_onboarding_email,
            to_email=email_lower,
            name=body.name,
            username=generated_username,
            password=generated_password,
            login_url="http://localhost:5173/login",
        )

    return _fmt(query_one("SELECT * FROM tenants WHERE id = %s", (tid,)))


@router.post("/{tenant_id}/send-invite")
def resend_tenant_invite(tenant_id: str, background_tasks: BackgroundTasks):
    t = query_one("SELECT * FROM tenants WHERE id = %s", (tenant_id,))
    if not t:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")
    email = t.get("email")
    if not email or email == "—":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Tenant has no valid email address")

    email_lower = email.strip().lower()
    clean_name = t["name"].strip().replace(" ", "").lower()
    first_4_name = clean_name[:4] if clean_name else "user"
    clean_phone = "".join(c for c in (t.get("phone") or "") if c.isdigit())
    last_2_phone = clean_phone[-2:] if len(clean_phone) >= 2 else (clean_phone or "00")
    last_4_phone = clean_phone[-4:] if len(clean_phone) >= 4 else (clean_phone or "0000")

    generated_username = f"{clean_name}{last_2_phone}"
    generated_password = f"{first_4_name}{last_4_phone}"

    existing_user = query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email_lower,))
    if not existing_user:
        u_id = f"u_tenant_{uuid.uuid4().hex[:8]}"
        query(
            "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids) VALUES (%s,%s,%s,%s,%s,'tenant',ARRAY[%s]::TEXT[])",
            (u_id, email_lower, generated_password, t["name"], t.get("phone", ""), t["workspace_id"]),
            commit=True,
        )
    else:
        query(
            "UPDATE users SET password = %s WHERE LOWER(email) = LOWER(%s)",
            (generated_password, email_lower),
            commit=True,
        )

    background_tasks.add_task(
        send_tenant_onboarding_email,
        to_email=email_lower,
        name=t["name"],
        username=generated_username,
        password=generated_password,
        login_url="http://localhost:5173/login",
    )
    return {"message": f"Invite email queued for {email_lower}"}


@router.patch("/{tenant_id}")
def update_tenant(tenant_id: str, body: dict):
    r = query_one("SELECT * FROM tenants WHERE id = %s", (tenant_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")
    allowed = {"name", "room", "phone", "email", "since", "rent", "kyc"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [tenant_id]
    query(f"UPDATE tenants SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM tenants WHERE id = %s", (tenant_id,)))


@router.delete("/{tenant_id}", status_code=204)
def delete_tenant(tenant_id: str):
    query("DELETE FROM tenants WHERE id = %s", (tenant_id,), commit=True)


@router.post("/send-email")
def send_email_direct(body: EmailDirectIn):
    if not body.email or body.email == "—":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Tenant email is required")

    email_lower = body.email.strip().lower()
    clean_name = body.name.strip().replace(" ", "").lower()
    first_4_name = clean_name[:4] if clean_name else "user"
    clean_phone = "".join(c for c in (body.phone or "") if c.isdigit())
    last_2_phone = clean_phone[-2:] if len(clean_phone) >= 2 else (clean_phone or "00")
    last_4_phone = clean_phone[-4:] if len(clean_phone) >= 4 else (clean_phone or "0000")

    generated_username = f"{clean_name}{last_2_phone}"
    generated_password = f"{first_4_name}{last_4_phone}"

    # Upsert user record for tenant authentication
    existing_user = query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email_lower,))
    if not existing_user:
        u_id = f"u_tenant_{uuid.uuid4().hex[:8]}"
        query(
            "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids) VALUES (%s,%s,%s,%s,%s,'tenant',ARRAY[%s]::TEXT[])",
            (u_id, email_lower, generated_password, body.name, body.phone, body.workspace_id or ""),
            commit=True,
        )
    else:
        query(
            "UPDATE users SET password = %s, phone = %s WHERE LOWER(email) = LOWER(%s)",
            (generated_password, body.phone, email_lower),
            commit=True,
        )

    login_url = body.login_url or "http://localhost:5173/login"

    sent = send_tenant_onboarding_email(
        to_email=email_lower,
        name=body.name,
        username=generated_username,
        password=generated_password,
        login_url=login_url,
    )

    return {
        "success": sent,
        "email": email_lower,
        "username": generated_username,
        "password": generated_password,
        "message": f"Onboarding mail {'sent successfully' if sent else 'failed to send'} to {email_lower}",
    }

