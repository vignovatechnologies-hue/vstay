"""Billing router – Stripe subscription integrations."""
import os
import time
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
import stripe
from dotenv import load_dotenv
from app.database import query, query_one

load_dotenv()

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/billing", tags=["billing"])

# Initialize Stripe API Key dynamically
def get_stripe_key() -> str:
    load_dotenv(override=True)
    key = os.getenv("STRIPE_SECRET_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="STRIPE_SECRET_KEY is not configured in the backend environment (.env file)."
        )
    return key

# Frontend redirection base url
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


class CreateCheckoutSessionIn(BaseModel):
    planId: str  # "monthly" | "yearly"
    workspaceId: str


@router.post("/create-checkout-session")
def create_checkout_session(body: CreateCheckoutSessionIn):
    """Create a Stripe checkout session for a monthly/yearly subscription."""
    stripe.api_key = get_stripe_key()
    try:
        # Determine the price details in INR in paise (₹999.00 = 99900 paise)
        if body.planId == "monthly":
            amount = 99900  # ₹999.00 (in paise)
            name = "Hostly Monthly Plan"
        elif body.planId == "yearly":
            amount = 999900  # ₹9,999.00 (in paise)
            name = "Hostly Yearly Plan"
        else:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid plan ID.")

        # Check if workspace exists
        ws = query_one("SELECT * FROM workspaces WHERE id = %s", (body.workspaceId,))
        if not ws:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Workspace not found.")

        # Create checkout session with both Card and UPI enabled (inr one-time payment)
        session = stripe.checkout.Session.create(
            payment_method_types=["card", "upi"],
            line_items=[
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": name,
                            "description": f"Access for Hostly PG workspace: {ws['name']}",
                        },
                        "unit_amount": amount,
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{FRONTEND_URL}/pricing?session_id={{CHECKOUT_SESSION_ID}}&success=true&workspace_id={body.workspaceId}",
            cancel_url=f"{FRONTEND_URL}/pricing?success=false",
            client_reference_id=body.workspaceId,
            metadata={
                "workspace_id": body.workspaceId,
                "plan_id": body.planId,
            },
        )

        return {"url": session.url}

    except Exception as e:
        log.error(f"Error creating checkout session: {e}", exc_info=True)
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stripe initialization error: {str(e)}",
        )


@router.get("/verify-session")
def verify_session(session_id: str):
    """Verify Stripe checkout session and update workspace plan/subscription status."""
    stripe.api_key = get_stripe_key()
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status in ("paid", "no_payment_required") or session.status == "complete":
            workspace_id = session.metadata.get("workspace_id") or session.client_reference_id
            plan_id = session.metadata.get("plan_id", "monthly")

            stripe_sub_id = session.subscription or session.payment_intent or session.id
            stripe_cust_id = session.customer

            if not workspace_id:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Missing workspace in session metadata.")

            # Update the workspace status
            query(
                "UPDATE workspaces SET subscription_status = 'active', plan_id = %s, stripe_subscription_id = %s, stripe_customer_id = %s WHERE id = %s",
                (plan_id, stripe_sub_id, stripe_cust_id, workspace_id),
                commit=True,
            )

            # Retrieve updated workspace
            ws = query_one("SELECT * FROM workspaces WHERE id = %s", (workspace_id,))
            return {"status": "success", "workspace": ws}

        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Session payment is incomplete.")

    except Exception as e:
        log.error(f"Error verifying session: {e}", exc_info=True)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Webhook to receive subscription status updates asynchronously from Stripe."""
    stripe.api_key = get_stripe_key()
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    event = None
    try:
        if endpoint_secret and sig_header:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        else:
            # Fallback to direct event parse (useful for local testing without signature configured)
            import json
            data = json.loads(payload.decode("utf-8"))
            event = stripe.Event.construct_from(data, stripe.api_key)
    except Exception as e:
        log.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid payload signature.")

    event_type = event.get("type")
    data_object = event.get("data", {}).get("object", {})

    log.info(f"Received stripe webhook: {event_type}")

    if event_type == "checkout.session.completed":
        # Handled both synchronously and here
        workspace_id = data_object.get("metadata", {}).get("workspace_id") or data_object.get("client_reference_id")
        plan_id = data_object.get("metadata", {}).get("plan_id", "monthly")
        stripe_sub_id = data_object.get("subscription") or data_object.get("payment_intent") or data_object.get("id")
        stripe_cust_id = data_object.get("customer")

        if workspace_id:
            query(
                "UPDATE workspaces SET subscription_status = 'active', plan_id = %s, stripe_subscription_id = %s, stripe_customer_id = %s WHERE id = %s",
                (plan_id, stripe_sub_id, stripe_cust_id, workspace_id),
                commit=True,
            )

    elif event_type in ("invoice.payment_succeeded", "invoice.payment_failed"):
        stripe_sub_id = data_object.get("subscription")
        if stripe_sub_id:
            status_val = "active" if event_type == "invoice.payment_succeeded" else "unpaid"
            query(
                "UPDATE workspaces SET subscription_status = %s WHERE stripe_subscription_id = %s",
                (status_val, stripe_sub_id),
                commit=True,
            )

    elif event_type == "customer.subscription.deleted":
        stripe_sub_id = data_object.get("id")
        if stripe_sub_id:
            query(
                "UPDATE workspaces SET subscription_status = 'unpaid' WHERE stripe_subscription_id = %s",
                (stripe_sub_id,),
                commit=True,
            )

    return {"status": "ok"}
