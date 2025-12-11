# app/models.py
from pydantic import BaseModel
from typing import Literal, List

# --- Core Definitions ---
UserRole = Literal["admin", "officer", "soldier", "driver"]

# --- Database/Internal Models ---
class UserInDB(BaseModel):
    """Model representing a user as stored in the database."""
    username: str
    hashed_password: str
    role: UserRole
    # For face recognition: a list of floats (128 for dlib/face_recognition)
    face_encoding: List[float] | None = None 
    # Placeholder for a secured hash/template (Realistically needs WebAuthn/OS integration)
    fingerprint_hash: str | None = None 

# --- Authentication Models ---
class Token(BaseModel):
    """Model for the returned JWT token."""
    access_token: str
    token_type: str
    role: UserRole

class TokenData(BaseModel):
    """Model for the data contained inside the JWT token."""
    username: str | None = None
    role: UserRole | None = None