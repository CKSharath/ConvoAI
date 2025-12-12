from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import random

from app.database import SessionLocal
from app import models, schemas
from app.routes.auth import get_current_user
from app.services.security import create_access_token

router = APIRouter(prefix="/biometric", tags=["Biometrics"])


# ---------------------------------------
# DB Dependency
# ---------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------
# MOCK ML LOGIC (temporary for demo)
# ---------------------------------------

def mock_generate_template(raw_data: str) -> str:
    """Simulates ML generating a unique biometric template."""
    return f"tmpl_{random.randint(100000, 999999)}"


def mock_verify_template(stored_template: str, raw_data: str):
    """
    Simulates ML verification. Always matches with high confidence.
    Replace with real ML later.
    """
    return {
        "match": True,
        "confidence": random.uniform(90, 99)
    }


# --------------------------------------------------------
# 1️⃣  BIOMETRIC ENROLLMENT (ADMIN / OFFICER ONLY)
# --------------------------------------------------------
@router.post("/enroll", response_model=schemas.BiometricEnrollmentLogOut)
def enroll_biometric(
    data: schemas.BiometricEnrollmentRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Register biometric data (face/fingerprint) for a user.
    ONLY admin & officer can enroll biometrics.
    Drivers cannot enroll themselves.
    """

    # ✔ Allow only admin or officer to enroll biometrics
    if current_user.role not in ("ADMIN", "OFFICER"):
        raise HTTPException(
            status_code=403,
            detail="Only admin or officer can enroll biometric data."
        )

    # Step 1 → Generate template (mock ML)
    template_id = mock_generate_template(data.raw_data)

    # Step 2 → Deactivate old templates for same user + type
    db.query(models.BiometricTemplate).filter(
        models.BiometricTemplate.user_id == data.user_id,
        models.BiometricTemplate.type == data.type,
        models.BiometricTemplate.is_active == True
    ).update({"is_active": False})

    # Step 3 → Create new active template
    template = models.BiometricTemplate(
        user_id=data.user_id,
        type=data.type,
        template_id=template_id,
        is_active=True
    )

    db.add(template)
    db.commit()

    # Step 4 → Log the enrollment event
    log = models.BiometricEnrollmentLog(
        user_id=data.user_id,
        type=data.type,
        status="success",
        confidence=98.0  # mock value
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


# --------------------------------------------------------
# 2️⃣  BIOMETRIC VERIFICATION (LOGIN USING FACE/FINGER)
# --------------------------------------------------------
@router.post("/verify", response_model=schemas.BiometricLoginResponse)
def verify_biometric(
    request: Request,
    data: schemas.BiometricVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Verify face/fingerprint and log in the user.
    ALL users can verify biometrics (driver/officer/admin).
    """

    # Step 1 → Find active template
    template = (
        db.query(models.BiometricTemplate)
        .filter(
            models.BiometricTemplate.user_id == data.user_id,
            models.BiometricTemplate.type == data.type,
            models.BiometricTemplate.is_active == True
        )
        .first()
    )

    if not template:
        raise HTTPException(404, "No biometric template found for this user.")

    # Step 2 → ML verifies match (mock)
    result = mock_verify_template(template.template_id, data.raw_data)
    match, confidence = result["match"], result["confidence"]

    # Step 3 → Log verification event
    log = models.BiometricAuthLog(
        user_id=data.user_id,
        result=match,
        confidence=confidence,
        ip_address=request.client.host
    )

    db.add(log)
    db.commit()

    if not match:
        raise HTTPException(401, "Biometric authentication failed.")

    # Step 4 → If match, issue JWT
    user = db.query(models.User).filter(models.User.id == data.user_id).first()

    payload = {
        "sub": user.username,
        "role": user.role,
        "mission_id": user.mission_id
    }

    token = create_access_token(payload)

    return schemas.BiometricLoginResponse(
        access_token=token,
        token_type="bearer",
        message="Biometric authentication successful."
    )
