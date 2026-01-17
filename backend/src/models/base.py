from sqlmodel import SQLModel
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, func
from sqlmodel import Field

# Base Model
class Base(SQLModel):
    """
    Base class that includes common fields for all models.
    """
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"server_default": func.now()}
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()}
    )