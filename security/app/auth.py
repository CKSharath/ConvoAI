# app/auth.py
from datetime import datetime, timedelta
from typing import Dict, Any, List
import hashlib # Standard Python library for hashing
from jose import jwt # Still needed for JWT encoding/decoding
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status

from .models import UserInDB, UserRole

# --- Configuration & Setup ---
SECRET_KEY = "YOUR_SECRET_KEY"  # CRITICAL: CHANGE THIS IN PRODUCTION
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Password Utilities (REPLACED bcrypt with SHA256) ---

def hash_password(password: str) -> str:
    """ Hashes password using SHA256 (standard Python library). 
        NOTE: For maximum security, a production environment should use 
        passlib with a modern algorithm like Argon2 or scrypt, but this 
        solves your current dependency conflict.
    """
    # Encode the string to bytes and apply the hash function
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """ Verifies a plain password against a SHA256 hash. """
    return hash_password(plain_password) == hashed_password

# --- Dummy Database (Passwords hashed using the new SHA256 function) ---

# We need to hash the passwords once before the dictionary is created
ADMIN_PASS_HASH = hash_password("adminpass")
OFFICER_PASS_HASH = hash_password("officerpass")
SOLDIER_PASS_HASH = hash_password("soldierpass")
DRIVER_PASS_HASH = hash_password("driverpass")

DUMMY_USERS_DB: Dict[str, UserInDB] = {
    "admin_user": UserInDB(
        username="admin_user",
        hashed_password=ADMIN_PASS_HASH,
        role="admin",
        face_encoding=[0.1] * 128, # Dummy encoding
        fingerprint_hash="admin_fp_hash"
    ),
    "officer_user": UserInDB(
        username="officer_user",
        hashed_password=OFFICER_PASS_HASH,
        role="officer",
        face_encoding=[0.2] * 128
    ),
    "soldier_user": UserInDB(
        username="soldier_user",
        hashed_password=SOLDIER_PASS_HASH,
        role="soldier"
    ),
     "driver_user": UserInDB(
        username="driver_user",
        hashed_password=DRIVER_PASS_HASH,
        role="driver"
    )
}

def get_user(username: str) -> UserInDB | None:
    return DUMMY_USERS_DB.get(username)

# --- JWT Utilities (No changes needed) ---

def create_access_token(data: Dict[str, Any], expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Biometric Placeholders (No changes needed) ---

def check_for_spoofing(image_bytes: bytes) -> bool:
    """ Placeholder for Liveness Detection. """
    print("--- Running Liveness Check (Placeholder: Success) ---")
    return True 

def recognize_face(user_id: str, image_bytes: bytes) -> bool:
    """ Placeholder for Face Recognition Logic. """
    print(f"--- Running Face Recognition for {user_id} (Placeholder: Success) ---")
    return True 

def verify_fingerprint(user_id: str) -> bool:
    """ Placeholder for Fingerprint Verification. """
    print(f"--- Running Fingerprint Check for {user_id} (Placeholder: Success) ---")
    return True

# NOTE: The rest of the API logic in main.py remains the same, as it only calls
# the functions (e.g., verify_password) whose internal logic has changed.