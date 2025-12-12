from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import SessionLocal
from app import models, schemas
from app.services import security

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# -------------------------
# DB Dependency
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Helper
# -------------------------
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(
        models.User.username == username
    ).first()


# -------------------------
# USER SEEDING (INITIAL USERS)
# -------------------------
def seed_demo_users(db: Session):
    demo_users = [
        {
            "username": "general",
            "email": "general@army.gov",
            "password": "admin123",
            "role": "ADMIN",
            "mission_id": None
        },
        {
            "username": "officer",
            "email": "officer@army.gov",
            "password": "officer123",
            "role": "OFFICER",
            "mission_id": None
        },
        {
            "username": "driver",
            "email": "driver1@army.gov",
            "password": "driver123",
            "role": "DRIVER",
            "mission_id": 1
        }
    ]

    for u in demo_users:
        exists = db.query(models.User).filter(
            models.User.username == u["username"]
        ).first()

        if not exists:
            user = models.User(
                username=u["username"],
                email=u["email"],
                hashed_password=security.get_password_hash(u["password"]),
                role=u["role"],
                mission_id=u["mission_id"]
            )
            db.add(user)

    db.commit()


# -------------------------
# SIGNUP LOCKED
# -------------------------
@router.post("/signup")
def signup_disabled():
    raise HTTPException(
        status_code=403,
        detail="Signup disabled. Users are pre-provisioned by Admin."
    )


# -------------------------
# LOGIN / TOKEN
# -------------------------
@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_username(db, form_data.username)

    if not user or not security.verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    token_payload = {
        "sub": user.username,
        "role": user.role,
        "mission_id": user.mission_id
    }

    access_token = security.create_access_token(
        data=token_payload,
        expires_delta=timedelta(hours=8)
    )

    return {"access_token": access_token, "token_type": "bearer"}


# -------------------------
# CURRENT USER
# -------------------------
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = security.decode_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )

    user = get_user_by_username(db, payload["sub"])

    if not user:
        raise HTTPException(401, "User not found")

    return user


# -------------------------
# ROLE-BASED PERMISSION HELPERS
# -------------------------
async def require_admin(current=Depends(get_current_user)):
    if current.role != "ADMIN":
        raise HTTPException(403, "Admin access required")
    return current


async def require_officer(current=Depends(get_current_user)):
    if current.role not in ("ADMIN", "OFFICER"):
        raise HTTPException(403, "Officer or Admin access required")
    return current


async def require_driver(current=Depends(get_current_user)):
    if current.role != "DRIVER":
        raise HTTPException(403, "Driver access required")
    return current
