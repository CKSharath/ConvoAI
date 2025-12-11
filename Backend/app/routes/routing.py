from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.routes.auth import (
    get_current_user,
    require_officer,
    require_driver
)
from app.services.ml_engine import get_optimized_route

router = APIRouter(prefix="/routing", tags=["Routing"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# OFFICER MANUALLY RE-COMPUTES MISSION ROUTE
# ---------------------------------------------------------
@router.post("/recompute/{mission_id}", dependencies=[Depends(require_officer)])
def recompute_route(
    mission_id: int,
    db: Session = Depends(get_db),
):
    mission = db.query(models.Mission).filter(models.Mission.id == mission_id).first()

    if not mission:
        raise HTTPException(404, "Mission not found")

    payload = {
        "source": mission.source,
        "destination": mission.destination,
        "priority": mission.priority
    }

    new_route = get_optimized_route(payload)

    mission.route = new_route["route"]
    mission.safescore = new_route["safescore"]
    mission.eta = new_route["eta"]

    db.commit()
    return {"message": "Route recomputed", "route": new_route}


# ---------------------------------------------------------
# DRIVER: VIEW ONLY THEIR ROUTE
# ---------------------------------------------------------
@router.get("/my", dependencies=[Depends(require_driver)])
def get_my_route(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    mission = db.query(models.Mission).filter(
        models.Mission.id == current_user.mission_id
    ).first()

    if not mission:
        raise HTTPException(404, "No mission assigned")

    return mission.route


# ---------------------------------------------------------
# OFFICER: VIEW ANY MISSION ROUTE
# ---------------------------------------------------------
@router.get("/{mission_id}", dependencies=[Depends(require_officer)])
def get_route(
    mission_id: int,
    db: Session = Depends(get_db)
):
    mission = db.query(models.Mission).filter(models.Mission.id == mission_id).first()

    if not mission:
        raise HTTPException(404, "Mission not found")

    return mission.route
