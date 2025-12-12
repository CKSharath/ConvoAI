import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL")
    ML_URL = os.getenv("ML_URL")
    WEATHER_API = os.getenv("WEATHER_KEY")
    TRAFFIC_API = os.getenv("TRAFFIC_KEY")
    SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecret")
