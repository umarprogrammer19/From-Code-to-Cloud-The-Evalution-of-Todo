from typing import Generator
from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from data.database import get_session  # Absolute import from backend root
from ..services.auth import get_current_user, verify_user_id_in_token


def get_db_session() -> Generator[Session, None, None]:
    """
    Get a database session for use with dependency injection.
    """
    session_gen = get_session()
    session = next(session_gen)
    try:
        yield session
    finally:
        # Properly close the session
        session.close()


# Re-export commonly used dependencies
get_current_user_dependency = get_current_user
verify_user_id_dependency = verify_user_id_in_token