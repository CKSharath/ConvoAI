# app/main.py
from typing import Union
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from pathlib import Path
from datetime import timedelta
from .models import UserInDB, Token
from .auth import (
    verify_password, get_user, create_access_token,
    check_for_spoofing, recognize_face, verify_fingerprint,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI()

# --- Static File Setup (Requires 'static' folder to be in the project root) ---
app.mount(
    "/static", 
    StaticFiles(directory=Path("static")), 
    name="static"
)

# Root route to serve the index.html
@app.get("/", response_class=HTMLResponse)
async def serve_login_page():
    index_file_path = Path("static") / "index.html"
    if not index_file_path.is_file():
        # Make sure you run 'uvicorn main:app --app-dir app' from the project root
        return HTMLResponse("<h1>404: Frontend (index.html) not found. Check static folder setup.</h1>", status_code=404)
        
    with open(index_file_path, "r") as f:
        html_content = f.read()
        
    return HTMLResponse(content=html_content)


# --- API Endpoints ---

@app.post("/token", response_model=Union[Token, dict])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Step 1: Standard Username/Password Authentication and Role Check.
    Determines the required next factor based on role.
    """
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Role-Aware Authentication Logic
    if user.role in ["soldier", "driver"]:
        # Role requires only password. Grant token immediately.
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return Token(access_token=access_token, token_type="bearer", role=user.role)
    
    elif user.role == "officer":
        # Officer requires Face MFA.
        return {"next_step": "mfa_face", "user_id": user.username, "role": user.role}
        
    elif user.role == "admin":
        # Admin requires Face + Fingerprint MFA.
        return {"next_step": "mfa_face_fingerprint", "user_id": user.username, "role": user.role}


@app.post("/mfa/face_verify", response_model=Union[Token, dict])
async def verify_face_id(user_id: str, file: UploadFile = File(...)):
    """
    Step 2: Face Recognition and Anti-Spoofing Check.
    """
    user = get_user(user_id)
    if not user:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
         
    image_bytes = await file.read()
    
    # 1. Anti-Spoofing/Liveness Check
    if not check_for_spoofing(image_bytes):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Liveness check failed. Denied.")
        
    # 2. Face Recognition Check
    if not user.face_encoding or not recognize_face(user_id, image_bytes):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Face recognition failed. Denied.")
        
    # 3. Check Role for Next Factor
    if user.role == "officer":
        # Officer's login is complete. Grant token.
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return Token(access_token=access_token, token_type="bearer", role=user.role)

    elif user.role == "admin":
        # Admin needs the next step: Fingerprint.
        return {"next_step": "mfa_fingerprint", "user_id": user.username, "role": user.role}
    
    # Should not happen
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid flow")


@app.post("/mfa/fingerprint_verify", response_model=Token)
async def verify_fingerprint_id(user_id: str):
    """
    Step 3: Fingerprint Verification (Only triggered for Admin).
    In a real scenario, the client sends a WebAuthn signature or similar secure data here.
    """
    user = get_user(user_id)
    if not user:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fingerprint not required for this role.")

    # 1. Fingerprint Check (Placeholder)
    if not verify_fingerprint(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fingerprint verification failed. Denied.")
        
    # Admin's login is complete. Grant token.
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(access_token=access_token, token_type="bearer", role=user.role)