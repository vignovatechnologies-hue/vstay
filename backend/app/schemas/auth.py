"""Auth schemas – login and signup request bodies."""
from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginIn(BaseModel):
    """Request body for POST /api/auth/login."""
    email: EmailStr
    password: str


class SignupIn(BaseModel):
    """Request body for POST /api/auth/signup."""
    fullName: str
    email: EmailStr
    phone: str
    hostelName: str
    password: Optional[str] = "password"
    planId: Optional[str] = None
