# app/routes/outbox.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.routes.auth import require_officer, get_current_user
from app import models, schemas

router = APIRouter(prefix="/outbox", tags=["Outbox"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", dependencies=[Depends(require_officer)])
def list_outbox(db: Session = Depends(get_db)):
    rows = db.query(models.EmailOutbox).order_by(models.EmailOutbox.created_at.desc()).limit(200).all()
    result = []
    for r in rows:
        result.append({
            "id": r.id,
            "subject": r.subject,
            "recipients": r.recipients,
            "sent": r.sent,
            "created_at": r.created_at.isoformat()
        })
    return result

@router.get("/{out_id}", dependencies=[Depends(require_officer)])
def get_outbox(out_id: int, db: Session = Depends(get_db)):
    r = db.query(models.EmailOutbox).filter(models.EmailOutbox.id == out_id).first()
    if not r:
        raise HTTPException(404, "Outbox item not found")
    return {
        "id": r.id,
        "subject": r.subject,
        "recipients": r.recipients,
        "sent": r.sent,
        "created_at": r.created_at.isoformat(),
        "html_body": r.html_body
    }