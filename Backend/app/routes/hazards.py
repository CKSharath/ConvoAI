from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas import HazardIn
from app.models import HazardEvent, Mission
from app.services.reroute import compute_new_route
from app.routes.auth import (
    get_current_user,
    require_officer,
    require_driver
)
from app.sockets.tracker import broadcast_route

router = APIRouter(prefix="/hazard", tags=["Hazards"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# REPORT HAZARD → DRIVER (own mission) + OFFICER
# ---------------------------------------------------------
@router.post("/", dependencies=[Depends(get_current_user)])
async def report_hazard(
    data: HazardIn,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # DRIVER must only report hazard for THEIR mission
    if current_user.role == "DRIVER":
        if data.mission_id != current_user.mission_id:
            raise HTTPException(403, "You cannot report hazard for another mission")

    hazard = HazardEvent(
        mission_id=data.mission_id,
        type=data.type,
        location=data.location,
        severity=data.severity
    )
    db.add(hazard)
    db.commit()

    # Re-route only if OFFICER reports or system auto-triggers
    mission = db.query(Mission).filter(Mission.id == data.mission_id).first()

    new_route = compute_new_route(mission, data.location)

    mission.route = new_route["route"]
    mission.safescore = new_route["safescore"]
    mission.eta = new_route["eta"]
    db.commit()

    # Broadcast map update to dashboards
    await broadcast_route({
        "mission_id": mission.id,
        "route": new_route
    })

    return {"message": "Hazard logged and route updated"}


# ---------------------------------------------------------
# VIEW ALL HAZARDS → OFFICER + ADMIN
# ---------------------------------------------------------
@router.get("/all", dependencies=[Depends(require_officer)])
def get_all_hazards(db: Session = Depends(get_db)):
    return db.query(HazardEvent).all()


# ---------------------------------------------------------
# DRIVER: VIEW ONLY THEIR MISSION HAZARDS
# ---------------------------------------------------------
@router.get("/my", dependencies=[Depends(require_driver)])
def get_my_hazards(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(HazardEvent).filter(
        HazardEvent.mission_id == current_user.mission_id
    ).all()
