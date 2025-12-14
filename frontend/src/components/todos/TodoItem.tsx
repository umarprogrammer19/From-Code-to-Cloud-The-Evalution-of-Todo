import React from 'react';
import Button from '@/components/ui/Button';

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, title: string, description: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  description,
  completed,
  onToggle,
  onDelete,
  onEdit
}) => {
  const handleToggle = () => {
    onToggle(id, !completed);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm mb-3 transition-all duration-300 transform hover:scale-[1.01] ${
        completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}
      role="listitem"
      aria-labelledby={`todo-title-${id}`}
    >
      <div className="flex items-start">
        <input
          id={`todo-checkbox-${id}`}
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-transform duration-200"
          aria-describedby={description ? `todo-desc-${id}` : undefined}
          aria-label={completed ? `Mark "${title}" as incomplete` : `Mark "${title}" as complete`}
        />
        <div className="ml-3 flex-1 transition-opacity duration-200">
          <h3
            id={`todo-title-${id}`}
            className={`text-lg font-medium transition-all duration-200 ${completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
          >
            {title}
          </h3>
          {description && (
            <p
              id={`todo-desc-${id}`}
              className={`mt-1 text-gray-600 transition-all duration-200 ${completed ? 'line-through' : ''}`}
            >
              {description}
            </p>
          )}
          <div className="mt-2 flex space-x-2 transition-opacity duration-200" role="group" aria-label="Todo item actions">
            <Button
              variant={completed ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleToggle}
              aria-label={completed ? `Mark "${title}" as incomplete` : `Mark "${title}" as complete`}
            >
              {completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              aria-label={`Delete todo "${title}"`}
            >
              Delete
            </Button>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(id, title, description || '')}
                aria-label={`Edit todo "${title}"`}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;