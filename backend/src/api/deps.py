from typing import Generator
from fastapi import Depends, HTTPException, status
from sqlmodel import Session
from data.database import get_session
from ..services.auth import get_current_user, verify_user_id_in_token


def get_db_session() -> Generator[Session, None, None]:
    """
    Get a database session for use with dependency injection.
    """
    yield next(get_session())


# Re-export commonly used dependencies
get_current_user_dependency = get_current_user
verify_user_id_dependency = verify_user_id_in_token