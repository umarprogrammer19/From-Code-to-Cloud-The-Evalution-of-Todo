from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional
from ...services.task_service import TaskService
from ...schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ...api.deps import get_db_session
from ...services.auth import get_current_user
from ...models.task import Task

router = APIRouter()


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task_simple(
    *,
    db_session: Session = Depends(get_db_session),
    current_user_id: int = Depends(get_current_user),
    task_in: TaskCreate
):
    """
    Create a new task for the authenticated user.
    User ID is extracted from the JWT token.
    """
    task = TaskService.create_task(session=db_session, task_in=task_in, user_id=current_user_id)
    return task


@router.get("/tasks", response_model=List[TaskResponse])
def read_tasks_simple(
    *,
    db_session: Session = Depends(get_db_session),
    current_user_id: int = Depends(get_current_user),
    priority: Optional[str] = None
):
    """
    Get all tasks for the authenticated user, optionally filtered by priority.
    User ID is extracted from the JWT token.
    """
    from ...models.task import PriorityLevel
    priority_enum = None
    if priority:
        try:
            priority_enum = PriorityLevel(priority)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid priority value. Must be one of: low, medium, high, urgent"
            )

    tasks = TaskService.get_tasks_by_user(session=db_session, user_id=current_user_id, priority=priority_enum)
    return tasks


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task_simple(
    *,
    db_session: Session = Depends(get_db_session),
    current_user_id: int = Depends(get_current_user),
    task_id: int,
    task_in: TaskUpdate
):
    """
    Update a specific task for the authenticated user.
    User ID is extracted from the JWT token.
    """
    task = TaskService.update_task(
        session=db_session,
        task_id=task_id,
        task_in=task_in,
        user_id=current_user_id
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_simple(
    *,
    db_session: Session = Depends(get_db_session),
    current_user_id: int = Depends(get_current_user),
    task_id: int
):
    """
    Delete a specific task for the authenticated user.
    User ID is extracted from the JWT token.
    """
    success = TaskService.delete_task(
        session=db_session,
        task_id=task_id,
        user_id=current_user_id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return {"message": "Task deleted successfully"}