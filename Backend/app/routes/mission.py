from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.services.ml_engine import get_optimized_route
from app.routes.auth import (
    get_current_user,
    require_officer,
    require_admin,
    require_driver
)

router = APIRouter(prefix="/mission", tags=["Mission"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# CREATE MISSION → OFFICER + ADMIN ONLY
# ---------------------------------------------------------
@router.post("/", response_model=schemas.MissionOut, dependencies=[Depends(require_officer)])
def create_mission(
    data: schemas.MissionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    route_data = get_optimized_route(data.dict())

    if "route" not in route_data:
        raise HTTPException(500, "Route engine failed")

    mission = models.Mission(
        source=data.source,
        destination=data.destination,
        priority=data.priority,
        route=route_data["route"],
        safescore=route_data.get("safescore", 0),
        eta=route_data.get("eta", 0)
    )

    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


# ---------------------------------------------------------
# VIEW ALL MISSIONS → OFFICER + ADMIN ONLY
# ---------------------------------------------------------
@router.get("/all", dependencies=[Depends(require_officer)])
def get_all_missions(db: Session = Depends(get_db)):
    return db.query(models.Mission).all()


# ---------------------------------------------------------
# DRIVER VIEW THEIR OWN MISSION ONLY
# ---------------------------------------------------------
@router.get("/my", dependencies=[Depends(require_driver)])
def get_my_mission(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    mission = db.query(models.Mission).filter(
        models.Mission.id == current_user.mission_id
    ).first()

    if not mission:
        raise HTTPException(404, "No mission assigned")

    return mission


# ---------------------------------------------------------
# DELETE MISSION → ADMIN ONLY
# ---------------------------------------------------------
@router.delete("/{mission_id}", dependencies=[Depends(require_admin)])
def delete_mission(mission_id: int, db: Session = Depends(get_db)):
    mission = db.query(models.Mission).filter(models.Mission.id == mission_id).first()

    if not mission:
        raise HTTPException(404, "Mission not found")

    db.delete(mission)
    db.commit()
    return {"message": "Mission deleted"}
