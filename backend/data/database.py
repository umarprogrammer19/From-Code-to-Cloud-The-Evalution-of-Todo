from sqlmodel import create_engine, Session
from sqlalchemy import text
from typing import Generator
import os
from contextlib import contextmanager

# Get database URL from environment, with a default for development
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")

# Create the engine with appropriate settings for async use
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True to see SQL queries in logs
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections after 5 minutes
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
    from src.models.base import SQLModel
    SQLModel.metadata.create_all(engine)

def test_connection():
    """
    Test the database connection.
    """
    with Session(engine) as session:
        result = session.exec(text("SELECT 1")).first()
        return result is not None