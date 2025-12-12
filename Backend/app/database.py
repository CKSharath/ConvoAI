# Backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import make_url
import getpass

from app.config import Config   # Your config file


# Base is kept global so your models can inherit from it
Base = declarative_base()


def _engine_with_prompt():
    """
    Build a fresh SQLAlchemy Engine by prompting for the DB password.
    This happens EVERY TIME a DB session is requested.
    """
    # Parse the base URL (which should NOT contain a password)
    url = make_url(Config.DATABASE_URL)

    # Ask user for the password (no echo)
    password = getpass.getpass(prompt="Enter database password: ")

    # Inject password into URL
    url = url.set(password=password)

    # Build engine with the password
    engine = create_engine(url)

    return engine


def get_db():
    """
    Creates a NEW engine + NEW DB session for every request.
    Prompts for password each time.
    Disposes engine after use.
    """
    engine = _engine_with_prompt()

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
        engine.dispose()
