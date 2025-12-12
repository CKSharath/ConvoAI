from app.database import SessionLocal
from app import models
from app.sockets.tracker import broadcast_alert
import asyncio

def store_sos(db, mission_id, triggered_by, reason=None, lat=None, lng=None):
    sos = models.SOSEvent(
        mission_id=mission_id,
        triggered_by=triggered_by,
        reason=reason,
        lat=lat,
        lng=lng
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)
    return sos

async def notify_sos_to_clients(sos_obj, db):
    """
    Broadcast alert to all connected dashboards and optionally
    create officer notifications / email (mock).
    """
    data = {
        "id": sos_obj.id,
        "mission_id": sos_obj.mission_id,
        "triggered_by": sos_obj.triggered_by,
        "reason": sos_obj.reason,
        "lat": sos_obj.lat,
        "lng": sos_obj.lng,
        "timestamp": sos_obj.timestamp.isoformat()
    }
    # broadcast websocket alert
    await broadcast_alert(data)

    # (Optional) Mock: create internal notification entries or call external alerting
    # For demo, we'll just return True
    return True
