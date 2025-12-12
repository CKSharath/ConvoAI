# app/services/emailer.py
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List
from app.config import Config
from app.database import SessionLocal
from app import models
import json

USE_MOCK = os.getenv("USE_MOCK_EMAIL", "true").lower() == "true"

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")
SENDER_NAME = os.getenv("SENDER_NAME", "ConvoAI Alerts")

def _save_to_outbox(subject: str, html_body: str, recipients: List[str], sent_flag: bool):
    # Save outgoing email to DB for demo / viewing
    db = SessionLocal()
    try:
        out = models.EmailOutbox(
            subject=subject,
            recipients=recipients,
            html_body=html_body,
            sent=sent_flag
        )
        db.add(out)
        db.commit()
        db.refresh(out)
        return out
    finally:
        db.close()

def send_email_html(subject: str, html_body: str, recipients: List[str]) -> bool:
    """
    Sends email. If USE_MOCK is true, save to DB outbox (and also print to console).
    Returns True if 'sent' (or saved).
    """
    if not recipients:
        return False

    if USE_MOCK:
        # Save the email to DB outbox so frontend/demo can view it
        out = _save_to_outbox(subject, html_body, recipients, sent_flag=False)
        # Also print to console so devs can quickly see it
        print("=== MOCK EMAIL saved to outbox ===")
        print("Subject:", subject)
        print("Recipients:", recipients)
        print("Outbox ID:", out.id)
        # optionally write to a local file (uncomment if desired)
        # with open("mock_emails.log", "a", encoding="utf8") as f:
        #     f.write(f"OUTBOX {out.id}\nSubject: {subject}\nRecipients: {recipients}\n\n{html_body}\n\n---\n")
        return True

    # real send via SMTP
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
    msg["To"] = ", ".join(recipients)
    part = MIMEText(html_body, "html")
    msg.attach(part)

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        if SENDER_EMAIL and SENDER_PASSWORD:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipients, msg.as_string())

    # Save a record showing it was actually sent
    _save_to_outbox(subject, html_body, recipients, sent_flag=True)
    return True