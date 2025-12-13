from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate
from fastapi import HTTPException, status


class TaskService:
    """
    Service class for handling task business logic.
    """

    @staticmethod
    def create_task(*, session: Session, task_in: TaskCreate, user_id: int) -> Task:
        """
        Create a new task for the specified user.
        """
        task = Task(
            title=task_in.title,
            description=task_in.description,
            completed=task_in.completed,
            user_id=user_id
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def get_task_by_id(*, session: Session, task_id: int, user_id: int) -> Optional[Task]:
        """
        Get a task by its ID for the specified user.
        """
        task = session.get(Task, task_id)
        if not task:
            return None
        if task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Task does not belong to the user"
            )
        return task

    @staticmethod
    def get_tasks_by_user(*, session: Session, user_id: int) -> List[Task]:
        """
        Get all tasks for the specified user.
        """
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks

    @staticmethod
    def update_task(*, session: Session, task_id: int, task_in: TaskUpdate, user_id: int) -> Optional[Task]:
        """
        Update an existing task for the specified user.
        """
        task = session.get(Task, task_id)
        if not task:
            return None
        if task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Task does not belong to the user"
            )

        update_data = task_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def delete_task(*, session: Session, task_id: int, user_id: int) -> bool:
        """
        Delete a task for the specified user.
        """
        task = session.get(Task, task_id)
        if not task:
            return False
        if task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Task does not belong to the user"
            )

        session.delete(task)
        session.commit()
        return True