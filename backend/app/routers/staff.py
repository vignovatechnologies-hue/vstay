"""Staff router – CRUD for workspace staff."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from app.database import query, query_one
from app.services.email import send_staff_onboarding_email

router = APIRouter(prefix="/api/staff", tags=["staff"])


class StaffIn(BaseModel):
    workspace_id: str
    name: str
    role: Optional[str] = "Reception"
    phone: Optional[str] = ""
    email: Optional[str] = ""
    shift: Optional[str] = "Day"
    status: Optional[str] = "active"


class EmailDirectIn(BaseModel):
    name: str
    email: str
    role: Optional[str] = "Staff"
    phone: Optional[str] = ""
    login_url: Optional[str] = ""
    workspace_id: Optional[str] = ""


def _fmt(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "initials": r.get("initials", ""),
        "role": r.get("role", ""),
        "phone": r.get("phone", ""),
        "email": r.get("email", ""),
        "shift": r.get("shift", "Day"),
        "status": r.get("status", "active"),
    }


@router.get("")
def list_staff(workspaceId: str):
    rows = query("SELECT * FROM staff WHERE workspace_id = %s ORDER BY created_at DESC", (workspaceId,), fetch=True)
    return [_fmt(r) for r in (rows or [])]


@router.post("", status_code=201)
def create_staff(body: StaffIn, background_tasks: BackgroundTasks):
    sid = f"s-{uuid.uuid4().hex[:8]}"
    parts = body.name.strip().split()
    initials = ((parts[0][0] if parts else "") + (parts[1][0] if len(parts) > 1 else "")).upper() or "S"
    query(
        "INSERT INTO staff (id,workspace_id,name,initials,role,phone,email,shift,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
        (sid, body.workspace_id, body.name, initials, body.role, body.phone, body.email, body.shift, body.status),
        commit=True,
    )

    # Auto-create user credentials for staff login
    if body.email and body.email != "—":
        email_lower = body.email.strip().lower()
        clean_name = body.name.strip().replace(" ", "").lower()
        first_4_name = clean_name[:4] if clean_name else "user"
        clean_phone = "".join(c for c in (body.phone or "") if c.isdigit())
        last_2_phone = clean_phone[-2:] if len(clean_phone) >= 2 else (clean_phone or "00")
        last_4_phone = clean_phone[-4:] if len(clean_phone) >= 4 else (clean_phone or "0000")

        generated_username = f"{clean_name}{last_2_phone}"
        generated_password = f"{first_4_name}{last_4_phone}"
        user_role = "manager" if body.role and body.role.lower() == "manager" else "staff"

        existing_staff_user = query_one(
            "SELECT id FROM users WHERE (LOWER(email) = LOWER(%s) AND role IN ('manager', 'staff', 'reception', 'accountant', 'warden', 'housekeeping', 'security', 'maintenance', 'laundry', 'cook')) OR (username IS NOT NULL AND LOWER(username) = LOWER(%s))",
            (email_lower, generated_username),
        )
        if not existing_staff_user:
            u_id = f"u_staff_{uuid.uuid4().hex[:8]}"
            user_email = email_lower
            if query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email_lower,)):
                user_email = f"{generated_username}@staff.vstay.app"
            query(
                "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids,username) VALUES (%s,%s,%s,%s,%s,%s,ARRAY[%s]::TEXT[],%s)",
                (u_id, user_email, generated_password, body.name, body.phone, user_role, body.workspace_id, generated_username),
                commit=True,
            )
        else:
            query(
                "UPDATE users SET password = %s, phone = %s, full_name = %s, role = %s, username = %s WHERE id = %s",
                (generated_password, body.phone, body.name, user_role, generated_username, existing_staff_user["id"]),
                commit=True,
            )

        background_tasks.add_task(
            send_staff_onboarding_email,
            to_email=email_lower,
            name=body.name,
            username=generated_username,
            password=generated_password,
            login_url="http://localhost:5173/login",
            role=body.role or "Staff",
        )

    return _fmt(query_one("SELECT * FROM staff WHERE id = %s", (sid,)))


@router.post("/{staff_id}/send-invite")
def resend_staff_invite(staff_id: str, background_tasks: BackgroundTasks):
    s = query_one("SELECT * FROM staff WHERE id = %s", (staff_id,))
    if not s:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Staff not found")
    email = s.get("email")
    if not email or email == "—":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Staff has no valid email address")

    email_lower = email.strip().lower()
    clean_name = s["name"].strip().replace(" ", "").lower()
    first_4_name = clean_name[:4] if clean_name else "user"
    clean_phone = "".join(c for c in (s.get("phone") or "") if c.isdigit())
    last_2_phone = clean_phone[-2:] if len(clean_phone) >= 2 else (clean_phone or "00")
    last_4_phone = clean_phone[-4:] if len(clean_phone) >= 4 else (clean_phone or "0000")

    generated_username = f"{clean_name}{last_2_phone}"
    generated_password = f"{first_4_name}{last_4_phone}"
    staff_role = s.get("role") or "Staff"
    user_role = "manager" if staff_role.lower() == "manager" else "staff"

    existing_user = query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email_lower,))
    if not existing_user:
        u_id = f"u_staff_{uuid.uuid4().hex[:8]}"
        query(
            "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids) VALUES (%s,%s,%s,%s,%s,%s,ARRAY[%s]::TEXT[])",
            (u_id, email_lower, generated_password, s["name"], s.get("phone", ""), user_role, s["workspace_id"]),
            commit=True,
        )
    else:
        query(
            "UPDATE users SET password = %s WHERE LOWER(email) = LOWER(%s)",
            (generated_password, email_lower),
            commit=True,
        )

    background_tasks.add_task(
        send_staff_onboarding_email,
        to_email=email_lower,
        name=s["name"],
        username=generated_username,
        password=generated_password,
        login_url="http://localhost:5173/login",
        role=staff_role,
    )
    return {
        "message": f"Staff onboarding email queued for {email_lower}",
        "username": generated_username,
        "password": generated_password,
    }


@router.post("/send-email")
def send_staff_email_direct(body: EmailDirectIn):
    if not body.email or body.email == "—":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Staff email is required")

    email_lower = body.email.strip().lower()
    clean_name = body.name.strip().replace(" ", "").lower()
    first_4_name = clean_name[:4] if clean_name else "user"
    clean_phone = "".join(c for c in (body.phone or "") if c.isdigit())
    last_2_phone = clean_phone[-2:] if len(clean_phone) >= 2 else (clean_phone or "00")
    last_4_phone = clean_phone[-4:] if len(clean_phone) >= 4 else (clean_phone or "0000")

    generated_username = f"{clean_name}{last_2_phone}"
    generated_password = f"{first_4_name}{last_4_phone}"
    staff_role = body.role or "Staff"
    user_role = "manager" if staff_role.lower() == "manager" else "staff"

    existing_user = query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email_lower,))
    if not existing_user:
        u_id = f"u_staff_{uuid.uuid4().hex[:8]}"
        query(
            "INSERT INTO users (id,email,password,full_name,phone,role,workspace_ids) VALUES (%s,%s,%s,%s,%s,%s,ARRAY[%s]::TEXT[])",
            (u_id, email_lower, generated_password, body.name, body.phone, user_role, body.workspace_id or ""),
            commit=True,
        )
    else:
        query(
            "UPDATE users SET password = %s, phone = %s, role = %s WHERE LOWER(email) = LOWER(%s)",
            (generated_password, body.phone, user_role, email_lower),
            commit=True,
        )

    login_url = body.login_url or "http://localhost:5173/login"

    sent = send_staff_onboarding_email(
        to_email=email_lower,
        name=body.name,
        username=generated_username,
        password=generated_password,
        login_url=login_url,
        role=staff_role,
    )

    return {
        "success": sent,
        "email": email_lower,
        "username": generated_username,
        "password": generated_password,
        "message": f"Staff onboarding email {'sent successfully' if sent else 'failed to send'} to {email_lower}",
    }


@router.patch("/{staff_id}")
def update_staff(staff_id: str, body: dict):
    r = query_one("SELECT * FROM staff WHERE id = %s", (staff_id,))
    if not r:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Staff not found")
    allowed = {"name", "role", "phone", "email", "shift", "status"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        return _fmt(r)
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    vals = list(updates.values()) + [staff_id]
    query(f"UPDATE staff SET {set_clause} WHERE id = %s", vals, commit=True)
    return _fmt(query_one("SELECT * FROM staff WHERE id = %s", (staff_id,)))


@router.delete("/{staff_id}", status_code=204)
def delete_staff(staff_id: str):
    query("DELETE FROM staff WHERE id = %s", (staff_id,), commit=True)
