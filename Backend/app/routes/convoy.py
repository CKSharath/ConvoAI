from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal
from app import models, schemas
from app.sockets.tracker import broadcast_position
from app.routes.auth import (
    get_current_user,
    require_driver,
    require_officer
)

router = APIRouter(prefix="/convoy", tags=["Convoy Tracking"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# DRIVER UPDATES LIVE GPS POSITION
# ---------------------------------------------------------
@router.post("/update", dependencies=[Depends(require_driver)])
async def update_position(
    data: schemas.PositionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Ensure driver updates ONLY their assigned mission
    if data.mission_id != current_user.mission_id:
        raise HTTPException(403, "You cannot update another mission's convoy")

    pos = models.ConvoyPosition(
        mission_id=data.mission_id,
        lat=data.lat,
        lng=data.lng,
        speed=data.speed,
        timestamp=datetime.utcnow().isoformat()
    )

    db.add(pos)
    db.commit()

    # Broadcast to officers/admin monitoring dashboard + drivers
    await broadcast_position({
        "mission_id": data.mission_id,
        "lat": data.lat,
        "lng": data.lng,
        "speed": data.speed,
        "timestamp": pos.timestamp
    })

    return {"message": "Position updated"}


# ---------------------------------------------------------
# OFFICER + ADMIN VIEW ALL LIVE POSITIONS
# ---------------------------------------------------------
@router.get("/all", dependencies=[Depends(require_officer)])
def get_all_positions(db: Session = Depends(get_db)):
    return db.query(models.ConvoyPosition).all()


# ---------------------------------------------------------
# DRIVER CHECKS OWN POSITION HISTORY
# ---------------------------------------------------------
@router.get("/my", dependencies=[Depends(require_driver)])
def get_my_positions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(models.ConvoyPosition).filter(
        models.ConvoyPosition.mission_id == current_user.mission_id
    ).all()
