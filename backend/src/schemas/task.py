from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class PriorityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class TaskCreate(BaseModel):
    """
    Schema for creating a new task.
    """
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[PriorityLevel] = None


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[PriorityLevel] = None


class TaskResponse(BaseModel):
    """
    Schema for task response from API.
    """
    id: int
    title: str
    description: Optional[str]
    completed: bool
    priority: PriorityLevel
    user_id: int
    created_at: datetime
    updated_at: datetime