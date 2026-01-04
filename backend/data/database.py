from sqlmodel import create_engine, Session
from sqlalchemy import text
from typing import Generator
import os
from contextlib import contextmanager

# Get database URL from environment, with a default for development
from src.config.settings import settings
DATABASE_URL = settings.database_url

# Create the engine with appropriate settings based on database type
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True to see SQL queries in logs
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections after 5 minutes
    connect_args=connect_args
)

def get_session() -> Generator[Session, None, None]:
    """
    Get a database session for use with dependency injection.
    """
    with Session(engine) as session:
        yield session

def init_db():
    """
    Initialize the database by creating all tables.
    This should be called when the application starts.
    """
    from src.models import User, Task  # Import all models to register them
    from src.models.base import SQLModel
    SQLModel.metadata.create_all(engine)

def test_connection():
    """
    Test the database connection.
    """
    with Session(engine) as session:
        result = session.exec(text("SELECT 1")).first()
        return result is not None