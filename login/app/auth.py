# app/auth.py
from datetime import datetime, timedelta
from typing import Dict, Any, List
import hashlib # Standard Python library for hashing
from jose import jwt # Still needed for JWT encoding/decoding
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status
import face_recognition
import numpy as np
import io
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
    # ...
    "admin_user": UserInDB(
        username="admin_user",
        hashed_password=ADMIN_PASS_HASH,
        role="admin",
        face_encoding=[0.01234, -0.05678, ... , 0.12345], # <--- PASTE THE LIST HERE!
        fingerprint_hash="admin_fp_hash"
    ),
    "officer_user": UserInDB(
        username="officer_user",
        hashed_password=OFFICER_PASS_HASH,
        role="officer",
        face_encoding=[0.01234, -0.05678, ... , 0.12345]  # <--- PASTE THE SAME LIST HERE!
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
    # ...
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
def check_for_spoofing(image_bytes: bytes) -> bool:
    """ 
    Placeholder for Liveness Detection. 
    NOTE: Real liveness detection requires a dedicated model (e.g., depth/blink analysis)
    and is extremely complex. This function remains a placeholder set to True.
    """
    print("--- Running Liveness Check (Placeholder: Success) ---")
    # You MUST replace this with real anti-spoofing logic for production security!
    return True 

def recognize_face(user_id: str, image_bytes: bytes) -> bool:
    """ 
    REAL Face Recognition Logic
    Compares the captured face encoding against the stored encoding in DUMMY_USERS_DB.
    """
    user = DUMMY_USERS_DB.get(user_id)
    if not user or not user.face_encoding:
        print(f"ERROR: User {user_id} has no stored face encoding.")
        return False
        
    stored_encoding = np.array(user.face_encoding)
    
    # 1. Load captured image from bytes
    image_stream = io.BytesIO(image_bytes)
    # face_recognition requires a file path or a numpy array, we convert the stream
    try:
        # Load image via Pillow (which face_recognition uses internally)
        from PIL import Image
        img = Image.open(image_stream).convert('RGB')
        captured_image = np.array(img)
    except Exception as e:
        print(f"Error loading image bytes: {e}")
        return False

    # 2. Get encoding from the captured image
    captured_encodings = face_recognition.face_encodings(captured_image)
    
    if not captured_encodings:
        print("Face recognition failed: No face found in captured frame.")
        return False
        
    captured_encoding = captured_encodings[0]
    
    # 3. Compare the captured face to the stored face
    # tolerance: 0.6 is a common value. Lower is stricter.
    tolerance = 0.6 
    
    # face_recognition.compare_faces returns a list of booleans (True/False for each stored face)
    matches = face_recognition.compare_faces([stored_encoding], captured_encoding, tolerance=tolerance)
    
    if True in matches:
        print(f"Face recognition successful for {user_id}. Match found.")
        return True
    else:
        print(f"Face recognition failed for {user_id}. Faces do not match.")
        return False

def verify_fingerprint(user_id: str) -> bool:
    # ... (remains a placeholder, set to True for testing admin flow)
    print(f"--- Running Fingerprint Check for {user_id} (Placeholder: Success) ---")
    return True
# NOTE: The rest of the API logic in main.py remains the same, as it only calls
# the functions (e.g., verify_password) whose internal logic has changed.