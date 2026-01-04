from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlmodel import Session, select
from typing import Optional
from ...models.user import User
from ...services.auth import create_access_token
from ...api.deps import get_db_session
from pydantic import BaseModel

router = APIRouter()

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class SignInRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

@router.post("/signin", response_model=Token)
def signin(
    signin_data: SignInRequest,
    db_session: Session = Depends(get_db_session)
):
    """
    Authenticate user and return JWT token.
    """
    # Find user by email
    statement = select(User).where(User.email == signin_data.email)
    user = db_session.exec(statement).first()

    if not user or not user.verify_password(signin_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token with user details - ensure name is available
    user_name = user.name or user.email.split('@')[0]
    access_token = create_access_token(
        data={"user_id": user.id, "name": user_name, "email": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(id=user.id, email=user.email, name=user_name)
    }


@router.post("/signup", response_model=Token)
def signup(
    signup_data: SignUpRequest,
    db_session: Session = Depends(get_db_session)
):
    """
    Create a new user and return JWT token.
    """
    # Check if user already exists
    statement = select(User).where(User.email == signup_data.email)
    existing_user = db_session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create new user - use email prefix as name if no name provided
    name = signup_data.name or signup_data.email.split('@')[0]
    user = User(email=signup_data.email, name=name)
    user.set_password(signup_data.password)

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create access token with user details - ensure name is available
    user_name = user.name or user.email.split('@')[0]
    access_token = create_access_token(
        data={"user_id": user.id, "name": user_name, "email": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(id=user.id, email=user.email, name=user_name)
    }