import React from 'react';
import TodoItem from './TodoItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Todo } from '@/types';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, title: string, description: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onToggle,
  onDelete,
  onEdit
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner text="Loading todos..." />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No todos yet. Add your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          description={todo.description}
          completed={todo.completed}
          createdAt={new Date(todo.createdAt)}
          updatedAt={new Date(todo.updatedAt)}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TodoList;