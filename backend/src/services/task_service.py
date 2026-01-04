from sqlmodel import Session, select
from typing import List, Optional
import logging
from ..models.task import Task, PriorityLevel
from ..schemas.task import TaskCreate, TaskUpdate
from fastapi import HTTPException, status

# Set up logging
logger = logging.getLogger(__name__)


class TaskService:
    """
    Service class for handling task business logic.
    """

    @staticmethod
    def create_task(*, session: Session, task_in: TaskCreate, user_id: int) -> Task:
        """
        Create a new task for the specified user.
        """
        from datetime import datetime, timezone
        logger.info(f"Creating task for user {user_id} with priority: {task_in.priority or 'medium'}")
        task = Task(
            title=task_in.title,
            description=task_in.description,
            completed=task_in.completed,
            priority=task_in.priority if task_in.priority else PriorityLevel.medium,
            user_id=user_id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        logger.info(f"Task created successfully with ID {task.id} and priority {task.priority}")
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
    def get_tasks_by_user(*, session: Session, user_id: int, priority: Optional[PriorityLevel] = None) -> List[Task]:
        """
        Get all tasks for the specified user, optionally filtered by priority.
        """
        logger.info(f"Retrieving tasks for user {user_id}, priority filter: {priority}")
        statement = select(Task).where(Task.user_id == user_id)
        if priority:
            statement = statement.where(Task.priority == priority)
        tasks = session.exec(statement).all()
        logger.info(f"Retrieved {len(tasks)} tasks for user {user_id}, priority filter: {priority}")
        return tasks

    @staticmethod
    def update_task(*, session: Session, task_id: int, task_in: TaskUpdate, user_id: int) -> Optional[Task]:
        """
        Update an existing task for the specified user.
        """
        from datetime import datetime, timezone
        task = session.get(Task, task_id)
        if not task:
            return None
        if task.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Task does not belong to the user"
            )

        logger.info(f"Updating task {task_id} for user {user_id}, priority update: {getattr(task_in, 'priority', None)}")
        update_data = task_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        # Update the updated_at timestamp
        task.updated_at = datetime.now(timezone.utc)

        session.add(task)
        session.commit()
        session.refresh(task)
        logger.info(f"Task {task_id} updated successfully, new priority: {task.priority}")
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