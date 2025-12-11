from fastapi import FastAPI
from app.routes import mission, convoy, hazards, auth, routing, biometric
from app.sockets import tracker
from app.database import Base, engine
from app import models
from app.routes.auth import seed_demo_users, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    seed_demo_users(db)

app.include_router(auth.router)
app.include_router(biometric.router)
app.include_router(mission.router)
app.include_router(hazards.router)
app.include_router(convoy.router)
app.include_router(routing.router)
app.include_router(tracker.router)


@app.get("/")
def home():
    return {"msg": "ConvoAI Backend Running"}
