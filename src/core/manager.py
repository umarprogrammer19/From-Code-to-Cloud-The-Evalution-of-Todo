import json
import os
from typing import List, Optional
from datetime import datetime
from .models import Task, TaskStatus, TaskPriority, TaskCollection


class TaskManager:
    def __init__(self, data_file: str = "data/tasks.json"):
        self.data_file = data_file
        self.collection = TaskCollection()
        self.load_from_file()

    def get_next_id(self) -> int:
        if not self.collection.tasks:
            return 1
        return max(task.id for task in self.collection.tasks) + 1

    def add_task(self, title: str, priority: TaskPriority = TaskPriority.MEDIUM) -> Task:
        task = Task(
            id=self.get_next_id(),
            title=title,
            priority=priority
        )
        self.collection.tasks.append(task)
        self.save_to_file()
        return task

    def get_all_tasks(self) -> List[Task]:
        return self.collection.tasks

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        for task in self.collection.tasks:
            if task.id == task_id:
                return task
        return None

    def update_task(self, task_id: int, new_title: str) -> bool:
        task = self.get_task_by_id(task_id)
        if task:
            task.title = new_title
            self.save_to_file()
            return True
        return False

    def complete_task(self, task_id: int) -> bool:
        task = self.get_task_by_id(task_id)
        if task and task.status != TaskStatus.DONE:
            task.status = TaskStatus.DONE
            task.completed_at = datetime.now()
            self.save_to_file()
            return True
        return False

    def delete_task(self, task_id: int) -> bool:
        task = self.get_task_by_id(task_id)
        if task:
            self.collection.tasks.remove(task)
            self.save_to_file()
            return True
        return False

    def save_to_file(self):
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        with open(self.data_file, 'w', encoding='utf-8') as f:
            f.write(self.collection.model_dump_json(indent=2))

    def load_from_file(self):
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if content.strip():
                    data = json.loads(content)
                    self.collection = TaskCollection.model_validate(data)
        else:
            # Create the file with an empty collection if it doesn't exist
            self.save_to_file()