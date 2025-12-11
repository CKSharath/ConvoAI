import os
import requests

# Load API keys from environment
GOOGLE_MAPS_KEY = os.getenv("MAPS_KEY")
WEATHER_KEY = os.getenv("WEATHER_KEY")
MAPBOX_KEY = os.getenv("MAPBOX_KEY")

# --------------------------------------------------
# 1. ROUTING + TRAFFIC (Google Maps Directions API)
# --------------------------------------------------

def get_route_and_traffic(source, destination):
    """
    Fetch route polyline, distance, duration, and traffic delay
    source & destination = "lat,lng"
    """
    url = (
        "https://maps.googleapis.com/maps/api/directions/json"
        f"?origin={source}&destination={destination}"
        "&departure_time=now"
        f"&key={GOOGLE_MAPS_KEY}"
    )

    response = requests.get(url)
    data = response.json()

    if not data.get("routes"):
        return None

    route = data["routes"][0]
    leg = route["legs"][0]

    return {
        "polyline": route["overview_polyline"]["points"],
        "distance_m": leg["distance"]["value"],
        "duration_s": leg["duration"]["value"],
        "traffic_duration_s": leg.get("duration_in_traffic", {}).get("value", leg["duration"]["value"])
    }

# --------------------------------------------------
# 2. WEATHER DATA (OpenWeather API)
# --------------------------------------------------

def get_weather(lat, lng):
    """
    Fetch current weather conditions
    """
    url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lng}&appid={WEATHER_KEY}&units=metric"
    )

    response = requests.get(url)
    data = response.json()

    return {
        "weather_main": data["weather"][0]["main"],  # Rain, Clear, Storm
        "weather_desc": data["weather"][0]["description"],
        "visibility": data.get("visibility", 10000),
        "wind_speed": data["wind"]["speed"],
        "temperature": data["main"]["temp"]
    }

# --------------------------------------------------
# 3. TERRAIN / ELEVATION (Mapbox)
# --------------------------------------------------

def get_terrain_elevation(lat, lng):
    """
    Fetch terrain elevation for slope estimation
    """
    url = (
        "https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/"
        f"{lng},{lat}.json"
        f"?layers=contour&limit=1&access_token={MAPBOX_KEY}"
    )

    response = requests.get(url)
    data = response.json()

    if not data.get("features"):
        return {"elevation": 0}

    elevation = data["features"][0]["properties"].get("ele", 0)
    return {"elevation": elevation}

# --------------------------------------------------
# 4. OPTIONAL: GEOCODING (Google Maps)
# --------------------------------------------------

def geocode_location(place_name):
    """
    Convert place name to lat/lng
    """
    url = (
        "https://maps.googleapis.com/maps/api/geocode/json"
        f"?address={place_name}&key={GOOGLE_MAPS_KEY}"
    )

    response = requests.get(url)
    data = response.json()

    if not data.get("results"):
        return None

    location = data["results"][0]["geometry"]["location"]
    return {"lat": location["lat"], "lng": location["lng"]}

# --------------------------------------------------
# 5. INTERNAL / SIMULATED DATA (NO EXTERNAL API)
# --------------------------------------------------

def get_no_go_zones():
    """
    Internal military restricted zones (mock data)
    """
    return [
        {
            "zone_id": 1,
            "polygon": [
                {"lat": 12.95, "lng": 77.60},
                {"lat": 12.96, "lng": 77.62},
                {"lat": 12.94, "lng": 77.64}
            ]
        }
    ]

def get_active_hazards():
    """
    Simulated hazards: potholes, roadblocks, accidents
    """
    return [
        {
            "type": "pothole",
            "lat": 12.971,
            "lng": 77.612,
            "severity": 3
        },
        {
            "type": "roadblock",
            "lat": 12.965,
            "lng": 77.605,
            "severity": 4
        }
    ]

def get_weak_bridges():
    """
    Bridges with weight limitations (static dataset)
    """
    return [
        {
            "bridge_id": "BR-101",
            "lat": 12.968,
            "lng": 77.601,
            "max_weight_tons": 20
        }
    ]
