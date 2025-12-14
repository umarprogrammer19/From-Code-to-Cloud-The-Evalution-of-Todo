import React from 'react';
import { useToggleTodoCompletionMutation, useDeleteTodoMutation } from '@/hooks/useTodos';
import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const toggleMutation = useToggleTodoCompletionMutation();
  const deleteMutation = useDeleteTodoMutation();

  const handleToggle = () => {
    toggleMutation.mutate({
      id: todo.id,
      completed: !todo.completed
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(todo.id);
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg mb-2 ${todo.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mr-3 h-5 w-5"
          disabled={toggleMutation.isPending}
        />
        <div>
          <h3 className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">
          {new Date(todo.updatedAt).toLocaleDateString()}
        </span>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;