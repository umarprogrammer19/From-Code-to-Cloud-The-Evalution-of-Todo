from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional, List


class TaskStatus(str, Enum):
    PENDING = "Pending"
    DONE = "Done"


class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Task(BaseModel):
    id: int
    title: str = Field(..., min_length=1)
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None


class TaskCollection(BaseModel):
    tasks: List[Task] = []