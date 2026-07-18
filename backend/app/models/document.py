"""Document model – shape of a row from the documents table."""
from pydantic import BaseModel
from typing import Optional


class DocumentModel(BaseModel):
    """Represents a document returned by the API (matches _fmt output in documents.py)."""
    id: str
    name: str = ""
    type: str = ""
    size: str = ""
    uploaded: str = ""
    status: str = "pending"   # "verified" | "pending" | "missing" | "rejected"
