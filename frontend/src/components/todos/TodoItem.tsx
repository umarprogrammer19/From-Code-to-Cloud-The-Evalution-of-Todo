import React, { useState } from 'react';
import { useToggleTodoCompletionMutation, useDeleteTodoMutation, useUpdateTodoMutation } from '@/hooks/useTodos';
import { Todo } from '@/types';
import { formatDate } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const toggleMutation = useToggleTodoCompletionMutation();
  const deleteMutation = useDeleteTodoMutation();
  const updateMutation = useUpdateTodoMutation();

  const handleToggle = () => {
    toggleMutation.mutate({
      id: todo.id,
      completed: !todo.completed
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSave = () => {
    updateMutation.mutate({
      id: todo.id,
      data: {
        title: editTitle,
        description: editDescription
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  if (isEditing) {
    return (
      <div className="flex flex-col p-4 border rounded-lg mb-2 bg-blue-50">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="mb-2 p-2 border rounded text-lg"
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="mb-2 p-2 border rounded text-sm"
          placeholder="Task description"
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

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
          {formatDate(todo.updatedAt)}
        </span>
        <button
          onClick={handleEdit}
          className="text-blue-500 hover:text-blue-700"
          disabled={updateMutation.isPending}
        >
          Edit
        </button>
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