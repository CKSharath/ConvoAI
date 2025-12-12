from app import models
from datetime import datetime, timedelta
import statistics

def summarize_mission(db, mission_id):
    """
    Collect mission events (positions, hazards, sos events) and compute metrics.
    Returns a text report and a score.
    """
    mission = db.query(models.Mission).filter(models.Mission.id == mission_id).first()
    if not mission:
        return None, 0.0

    # fetch hazards
    hazards = db.query(models.HazardEvent).filter(models.HazardEvent.mission_id == mission_id).all()
    # fetch positions
    positions = db.query(models.ConvoyPosition).filter(models.ConvoyPosition.mission_id == mission_id).order_by(models.ConvoyPosition.id).all()
    # fetch sos events
    sos = db.query(models.SOSEvent).filter(models.SOSEvent.mission_id == mission_id).all()
    # fetch auth logs counts
    from sqlalchemy import func
    failed_auths = db.query(func.count(models.BiometricAuthLog.id)).filter(
        models.BiometricAuthLog.user_id==models.BiometricAuthLog.user_id,
        models.BiometricAuthLog.result==False
    ).scalar() or 0

    # compute simple metrics
    total_hazards = len(hazards)
    total_sos = len(sos)
    total_positions = len(positions)

    # average speed (if speed available)
    speeds = [p.speed for p in positions if p.speed is not None]
    avg_speed = statistics.mean(speeds) if speeds else 0

    # mission duration approx (if positions have timestamps like ISO strings)
    mission_duration = "unknown"
    try:
        if positions:
            # assume timestamp stored as ISO string or accessible
            start = positions[0].timestamp
            end = positions[-1].timestamp
            mission_duration = "unknown"
            # If timestamps are strings, skip parsing for demo.
    except Exception:
        pass

    # Simple scoring heuristic
    score = 100.0
    score -= total_hazards * 5
    score -= total_sos * 10
    if avg_speed > 80:
        score -= 5

    score = max(0.0, round(score, 2))

    # Build textual report
    report_lines = []
    report_lines.append(f"Mission ID: {mission_id}")
    report_lines.append(f"SafeRoute Score: {getattr(mission, 'safescore', 'N/A')}")
    report_lines.append(f"Hazards encountered: {total_hazards}")
    for h in hazards:
        report_lines.append(f" - Hazard [{h.type}] severity {h.severity} at {getattr(h, 'location', {})}")
    report_lines.append(f"SOS events: {total_sos}")
    for s in sos:
        report_lines.append(f" - SOS triggered by user {s.triggered_by} reason: {s.reason} at {s.timestamp}")
    report_lines.append(f"Avg speed (observed): {avg_speed}")
    report_lines.append(f"Auth failures observed: {failed_auths}")
    report_lines.append(f"Computed mission score: {score}")
    report_content = "\n".join(report_lines)

    return report_content, score
