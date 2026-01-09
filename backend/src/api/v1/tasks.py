from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional
from ...services.task_service import TaskService
from ...schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ...api.deps import get_db_session, verify_user_id_dependency
from ...models.task import Task


router = APIRouter()

# Tasks Post
@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    *,
    db_session: Session = Depends(get_db_session),
    user_id: int = Depends(verify_user_id_dependency),
    task_in: TaskCreate
):
    """
    Create a new task for the specified user.
    """
    task = TaskService.create_task(session=db_session, task_in=task_in, user_id=user_id)
    return task


# Task Get
@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    *,
    db_session: Session = Depends(get_db_session),
    user_id: int = Depends(verify_user_id_dependency),
    priority: Optional[str] = None
):
    """
    Get all tasks for the specified user, optionally filtered by priority.
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

    tasks = TaskService.get_tasks_by_user(session=db_session, user_id=user_id, priority=priority_enum)
    return tasks


# Task Edit 
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    *,
    db_session: Session = Depends(get_db_session),
    user_id: int = Depends(verify_user_id_dependency),
    task_id: int,
    task_in: TaskUpdate
):
    """
    Update a specific task for the specified user.
    """
    task = TaskService.update_task(
        session=db_session,
        task_id=task_id,
        task_in=task_in,
        user_id=user_id
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


# Task Delete
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    *,
    db_session: Session = Depends(get_db_session),
    user_id: int = Depends(verify_user_id_dependency),
    task_id: int
):
    """
    Delete a specific task for the specified user.
    """
    success = TaskService.delete_task(
        session=db_session,
        task_id=task_id,
        user_id=user_id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return {"message": "Task deleted successfully"}