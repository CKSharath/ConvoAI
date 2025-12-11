from datetime import datetime, timedelta
from typing import Optional, List

from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status

from app.config import Config
from app.database import SessionLocal
from app import models
from fastapi.security import OAuth2PasswordBearer

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------------
# JWT settings
# -------------------------
SECRET_KEY = getattr(Config, "SECRET_KEY", "changemeplease")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# -------------------------
# Password helpers
# -------------------------
def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    return pwd_context.hash(password)


# -------------------------
# JWT helpers
# -------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    expire = (
        datetime.utcnow() + expires_delta
        if expires_delta
        else datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


# -------------------------
# DB dependency (local use)
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Current User (RBAC-aware)
# -------------------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db)
):
    payload = decode_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    username = payload.get("sub")
    user = db.query(models.User).filter(models.User.username == username).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    return user


# -------------------------
# 🔐 ROLE-BASED ACCESS
# -------------------------
def require_role(allowed_roles: List[str]):
    def checker(user: models.User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        return user
    return checker


# -------------------------
# 🔐 CONVOY-LEVEL ACCESS
# -------------------------
def require_convoy_access():
    """
    ADMIN / OFFICER → unrestricted
    DRIVER → restricted to own convoy
    """
    def checker(user: models.User = Depends(get_current_user)):
        if user.role == "DRIVER" and user.mission_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Driver not assigned to a convoy"
            )
        return user
    return checker
