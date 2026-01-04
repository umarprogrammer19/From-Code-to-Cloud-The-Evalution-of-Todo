from sqlmodel import SQLModel, Field
from typing import Optional
from passlib.context import CryptContext
from datetime import datetime
from sqlalchemy import DateTime, func
from sqlmodel import Field as SQLModelField

pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],  # Use argon2 as primary, bcrypt as fallback
    deprecated="auto",
)

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)


class User(UserBase, table=True):
    """
    User model for authentication.
    """
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(default="")
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": func.now()}
    )
    updated_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()}
    )

    def set_password(self, password: str):
        """Hash and set the user's password."""
        # Truncate password to 72 characters to comply with bcrypt limits
        truncated_password = password[:72] if len(password) > 72 else password
        self.hashed_password = pwd_context.hash(truncated_password)

    def verify_password(self, plain_password: str) -> bool:
        """Verify a plain password against the hashed password."""
        # Truncate password to 72 characters to comply with bcrypt limits
        truncated_password = plain_password[:72] if len(plain_password) > 72 else plain_password
        return pwd_context.verify(truncated_password, self.hashed_password)

    class Config:
        arbitrary_types_allowed = True