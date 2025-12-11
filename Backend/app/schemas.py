from pydantic import BaseModel, EmailStr, Field, validator
from typing import Dict, Optional, Literal


# -------------------------
# Mission Schemas
# -------------------------

class MissionCreate(BaseModel):
    source: Dict
    destination: Dict
    priority: str


class MissionOut(BaseModel):
    id: int
    route: Dict
    safescore: float
    eta: int

    class Config:
        orm_mode = True


# -------------------------
# Convoy & Hazard Schemas
# -------------------------

class PositionUpdate(BaseModel):
    mission_id: int
    lat: float
    lng: float
    speed: float


class HazardIn(BaseModel):
    mission_id: int
    type: str
    location: Dict
    severity: int


# -------------------------
# User & Auth Schemas
# -------------------------

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

    # 🔐 RBAC
    role: Literal["DRIVER", "OFFICER", "ADMIN"] = "DRIVER"
    mission_id: Optional[int] = None

    @validator("role")
    def prevent_admin_signup(cls, v):
        if v in ["ADMIN", "OFFICER"]:
            raise ValueError("Only drivers can self-register")
        return v

    @validator("mission_id", always=True)
    def driver_must_have_convoy(cls, v, values):
        if values.get("role") == "DRIVER" and v is None:
            raise ValueError("Driver must be assigned a convoy")
        return v


class UserOut(BaseModel):
    id: int
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: str
    mission_id: Optional[int]
    is_active: bool

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None
    mission_id: Optional[int] = None

class BiometricTemplateCreate(BaseModel):
    user_id: int
    type: str   # "FACE" or "FINGERPRINT"
    template_id: str
class BiometricTemplateOut(BaseModel):
    id: int
    user_id: int
    type: str
    template_id: str
    is_active: bool

    model_config = {"from_attributes": True}

class BiometricEnrollmentRequest(BaseModel):
    user_id: int
    type: str               # FACE or FINGERPRINT
    raw_data: str | None = None   # base64 or placeholder
class BiometricEnrollmentLogOut(BaseModel):
    id: int
    user_id: int
    type: str
    status: str          # success / failed
    confidence: float | None
    timestamp: str

    model_config = {"from_attributes": True}
class BiometricVerificationRequest(BaseModel):
    user_id: int
    type: str
    raw_data: str | None = None    # base64 or placeholder
class BiometricAuthLogOut(BaseModel):
    id: int
    user_id: int
    result: bool
    confidence: float | None
    ip_address: str | None
    timestamp: str

    model_config = {"from_attributes": True}
class BiometricLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    message: str = "Biometric authentication successful"
class UserBiometricsOut(BaseModel):
    user_id: int
    biometrics: list[BiometricTemplateOut]

    model_config = {"from_attributes": True}
