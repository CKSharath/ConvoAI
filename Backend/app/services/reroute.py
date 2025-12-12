from .ml_engine import get_optimized_route

def compute_new_route(mission, hazard_location):
    payload = {
        "source": mission.source,
        "destination": mission.destination,
        "priority": mission.priority,
        "avoid": hazard_location
    }
    return get_optimized_route(payload)
