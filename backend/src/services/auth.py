from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from ..config.settings import settings


# Use the secret key and algorithm from the settings
SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


class TokenData(BaseModel):
    user_id: Optional[int] = None


security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a new access token with the provided data.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get the current user from the JWT token.
    This function extracts the user_id from the JWT token and returns it.
    Supports both custom JWT tokens and Better Auth tokens.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])

        # Try to get user_id from different possible fields
        # Better Auth typically uses 'sub' (subject) or 'userId' field for user ID
        user_id_value = (
            payload.get("user_id")
            or payload.get("userId")
            or payload.get("sub")
            or payload.get("id")
        )

        # Convert to int if it's not already
        if user_id_value is not None:
            try:
                user_id: int = int(user_id_value)
            except (ValueError, TypeError):
                raise credentials_exception
        else:
            user_id = None

        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    return token_data.user_id


from fastapi import Request


async def verify_user_id_in_token(
    request: Request, current_user_id: int = Depends(get_current_user)
):
    """
    Verify that the user_id in the path matches the user_id in the JWT token.
    This is used as a dependency to enforce user data isolation.
    """
    # Extract user_id from the path using FastAPI's request object
    path_params = request.path_params
    path_user_id_str = path_params.get("user_id")

    if path_user_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User ID not found in path"
        )

    # Convert both to integers for comparison since user IDs can come as strings from paths
    try:
        path_user_id = int(path_user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format in path",
        )

    if path_user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ID in token does not match user ID in path",
        )
    return current_user_id
