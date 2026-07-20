"""Billing router – Razorpay payment gateway integration."""
import os
import time
import logging
import hmac
import hashlib
import json
import requests as http_requests
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from app.database import query, query_one

load_dotenv()

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/billing", tags=["billing"])


def get_razorpay_keys() -> tuple[str, str]:
    """Load Razorpay credentials dynamically from environment each time."""
    load_dotenv(override=True)
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    if not key_id or not key_secret:
        raise HTTPException(
            status_code=500,
            detail="RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in the backend .env file."
        )
    return key_id, key_secret


# ── Razorpay Order Creation ────────────────────────────────────────────────────

class CreateRazorpayOrderIn(BaseModel):
    planId: str       # e.g. "monthly" or "yearly" — label only, no amounts derived from it
    planName: str     # human-readable plan name from super admin config
    workspaceId: str
    amountPaise: int  # Exact amount in paise as set by super admin in Plans & Pricing


@router.post("/create-razorpay-order")
def create_razorpay_order(body: CreateRazorpayOrderIn):
    """Create a Razorpay order using the amount set by the super admin."""
    key_id, key_secret = get_razorpay_keys()

    if body.amountPaise <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plan amount must be greater than zero. Configure it in Super Admin → Plans & Pricing."
        )

    ws = query_one("SELECT * FROM workspaces WHERE id = %s", (body.workspaceId,))
    if not ws:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found.")

    receipt_id = f"rcpt_{body.workspaceId}_{int(time.time())}"

    try:
        response = http_requests.post(
            "https://api.razorpay.com/v1/orders",
            json={
                "amount": body.amountPaise,
                "currency": "INR",
                "receipt": receipt_id,
                "notes": {
                    "workspace_id": body.workspaceId,
                    "plan_id": body.planId,
                    "plan_name": body.planName,
                }
            },
            auth=(key_id, key_secret),
            timeout=15
        )
        response.raise_for_status()
        order_data = response.json()
    except http_requests.HTTPError as e:
        log.error(f"Razorpay order creation failed: {e} — {e.response.text if e.response else ''}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Razorpay API error: {e.response.json().get('error', {}).get('description', str(e)) if e.response else str(e)}"
        )
    except Exception as e:
        log.error(f"Razorpay order creation error: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    return {
        "keyId": key_id,
        "orderId": order_data["id"],
        "amount": body.amountPaise,
        "currency": "INR",
        "planId": body.planId,
        "planName": body.planName,
        "workspaceId": body.workspaceId,
    }


# ── Razorpay Payment Verification ─────────────────────────────────────────────

class VerifyRazorpayPaymentIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    workspaceId: str
    planId: str
    amountPaid: Optional[int] = None


@router.post("/verify-razorpay-payment")
def verify_razorpay_payment(body: VerifyRazorpayPaymentIn):
    """Verify Razorpay HMAC signature and activate workspace subscription."""
    _, key_secret = get_razorpay_keys()

    # HMAC-SHA256 signature check — prevents tampered payment callbacks
    msg = f"{body.razorpay_order_id}|{body.razorpay_payment_id}"
    expected = hmac.new(
        key_secret.encode("utf-8"),
        msg.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    if expected != body.razorpay_signature:
        log.warning("Razorpay signature mismatch — possible tampered callback.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment signature verification failed."
        )

    try:
        amount_paid = body.amountPaid if body.amountPaid is not None else 0
        query(
            """UPDATE workspaces
               SET subscription_status = 'active',
                   plan_id             = %s,
                   stripe_subscription_id = %s,
                   stripe_customer_id     = %s,
                   amount_paid            = %s
               WHERE id = %s""",
            (body.planId, body.razorpay_payment_id, body.razorpay_order_id, amount_paid, body.workspaceId),
            commit=True,
        )
        ws = query_one("SELECT * FROM workspaces WHERE id = %s", (body.workspaceId,))
        return {"status": "success", "workspace": ws}
    except Exception as e:
        log.error(f"Failed to update workspace after payment: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database update failed: {str(e)}"
        )
