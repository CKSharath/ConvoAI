from sqlalchemy import Column, Integer, String, Float, JSON, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(JSON)
    destination = Column(JSON)
    priority = Column(String)
    status = Column(String, default="scheduled")
    route = Column(JSON)  # polyline + points
    safescore = Column(Float, default=0)
    eta = Column(Integer, default=0)



class ConvoyPosition(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True)
    mission_id = Column(Integer, index=True)
    lat = Column(Float)
    lng = Column(Float)
    speed = Column(Float)
    timestamp = Column(String)


class HazardEvent(Base):
    __tablename__ = "hazards"

    id = Column(Integer, primary_key=True)
    mission_id = Column(Integer, index=True)
    type = Column(String)  # pothole, roadblock, snowstorm
    location = Column(JSON)
    severity = Column(Integer)
    active = Column(Boolean, default=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)

    # 🔐 RBAC CORE
    role = Column(
        String,
        default="DRIVER"
    )  # ADMIN | OFFICER | DRIVER

    mission_id = Column(
        Integer,
        nullable=True
    )  # Only for DRIVER role

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class BiometricTemplate(Base):
    __tablename__ = "biometric_templates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    type = Column(String, nullable=False)  # "FACE" / "FINGERPRINT"
    template_id = Column(String, nullable=False)  # reference returned by ML model

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class BiometricEnrollmentLog(Base):
    __tablename__ = "biometric_enrollment_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)  # FACE or FINGERPRINT
    status = Column(String)  # SUCCESS / FAILED
    confidence = Column(Integer, nullable=True)
    timestamp = Column(DateTime, server_default=func.now())


class BiometricAuthLog(Base):
    __tablename__ = "biometric_auth_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    result = Column(Boolean)  # True/False
    confidence = Column(Integer)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, server_default=func.now())
