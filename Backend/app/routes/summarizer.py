# app/routes/summarizer.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.summarizer import generate_summary
from app.routes.auth import get_current_user

router = APIRouter(prefix="/summarizer", tags=["summarizer"])

@router.post("/")
async def summarize_text(payload: dict, 
                         user = Depends(get_current_user), 
                         db: Session = Depends(get_db)):
    
    text = payload.get("text")

    if not text:
        raise HTTPException(status_code=400, detail="Text is required for summarization.")

    summary = generate_summary(text)
    return {"summary": summary}
