import os

USE_MOCK_ML = os.getenv("USE_MOCK_ML", "true").lower() == "true"

def get_optimized_route(payload: dict):
    if USE_MOCK_ML:
        return {
            "route": {
                "polyline": [
                    {"lat": 12.9716, "lng": 77.5946},
                    {"lat": 12.2958, "lng": 76.6394}
                ]
            },
            "safescore": 84.2,
            "eta": 175
        }

    # Real ML call will go here later
