from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, func
from sqlmodel import Field


class Base(SQLModel):
    """
    Base class that includes common fields for all models.
    """
    created_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": func.now()}
    )
    updated_at: Optional[datetime] = Field(
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()}
    )