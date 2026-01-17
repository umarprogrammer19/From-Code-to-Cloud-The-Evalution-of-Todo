from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from enum import Enum
from .base import Base

# Priority Schema 
class PriorityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class TaskBase(SQLModel):
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: PriorityLevel = Field(default=PriorityLevel.medium)
    user_id: int = Field(index=True)  # Foreign key reference to user


class Task(TaskBase, Base, table=True):
    """
    Task model representing a user's task.
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)


class TaskRead(TaskBase):
    """
    Schema for reading task data.
    """
    id: int