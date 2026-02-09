from database import create_db_and_tables, get_session
from sqlmodel import SQLModel
import logging
import os

# Configure logging to capture SQLModel output if DEBUG is true
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress debug logs from other modules unless DEBUG is true
if os.getenv("DEBUG", "False").lower() == "true":
    logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
else:
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)


if __name__ == "__main__":
    logger.info("Verifying database setup...")
    try:
        create_db_and_tables()
    except Exception as e:
        logger.error(f"Error during create_db_and_tables: {e}")
        import sys
        sys.exit(1)

    logger.info("Attempting to get a database session...")
    try:
        with next(get_session()) as session:
            logger.info(f"Successfully obtained a database session: {session}")
        logger.info("Database connection and SQLModel setup verified successfully.")
    except Exception as e:
        logger.error(f"Failed to get a database session: {e}")
        import sys
        sys.exit(1)
