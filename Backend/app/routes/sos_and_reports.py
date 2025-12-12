from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas
from app.routes.auth import get_current_user, require_driver, require_officer
from app.services.sos_service import store_sos, notify_sos_to_clients
from app.services.reports import summarize_mission
import asyncio

router = APIRouter(prefix="/ops", tags=["Operations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# SOS: Driver triggers emergency
# ---------------------------
@router.post("/sos/trigger", response_model=schemas.SOSTriggerResponse, dependencies=[Depends(require_driver)])
def trigger_sos(
    data: schemas.SOSTriggerRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # ensure driver can only trigger for their mission
    if data.mission_id != current_user.mission_id:
        raise HTTPException(403, "You cannot trigger SOS for another mission")

    sos_obj = store_sos(db, mission_id=data.mission_id, triggered_by=current_user.id, reason=data.reason, lat=data.lat, lng=data.lng)

    # notify dashboards in background (kick off async task)
    # since FastAPI endpoint is sync, schedule a background coroutine
    asyncio.create_task(notify_sos_to_clients(sos_obj, db))

    return sos_obj


# ---------------------------
# Incident Report: officer/admin generates report
# ---------------------------
@router.get("/reports/mission/{mission_id}", response_model=schemas.IncidentReportOut, dependencies=[Depends(require_officer)])
def generate_report(mission_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # build report content
    content, score = summarize_mission(db, mission_id)
    if content is None:
        raise HTTPException(404, "Mission not found")

    # persist report
    report = models.IncidentReport(
        mission_id=mission_id,
        generated_by=current_user.id,
        content=content,
        summary_score=score
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return report
