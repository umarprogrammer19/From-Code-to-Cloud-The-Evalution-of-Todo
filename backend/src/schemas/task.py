from pydantic import BaseModel, Field
from pydantic import ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum

# Priority Interface
class PriorityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


# Task Interface
class TaskCreate(BaseModel):
    """
    Schema for creating a new task.
    """
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[PriorityLevel] = None


# Task Update Interface
class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[PriorityLevel] = None


# Task Response Interface
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
    created_at: datetime = Field(alias="createdAt", serialization_alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt", serialization_alias="updatedAt")

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda v: v.isoformat()
        }
    )