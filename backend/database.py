"""Database setup module for chat history feature."""

from sqlmodel import create_engine, SQLModel  # Moved SQLModel import
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get database URL from environment or use default
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine - using StaticPool for SQLite to avoid threading issues in testing
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "False").lower() == "true",  # Only echo in debug mode
    poolclass=StaticPool if "sqlite://" in DATABASE_URL else None,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """Dependency to get database session."""
    logger.debug("Creating database session")
    session = SessionLocal()
    try:
        yield session
    except Exception as e:
        logger.error(f"Database session error: {str(e)}")
        session.rollback()
        raise
    finally:
        session.close()
        logger.debug("Closed database session")


def create_db_and_tables():
    """Create database tables."""
    logger.info("Dropping database tables if they exist...")
    SQLModel.metadata.drop_all(engine)  # Drop all tables
    logger.info("Creating database tables...")

    try:
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise
