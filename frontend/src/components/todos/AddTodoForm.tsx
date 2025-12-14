import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface AddTodoFormProps {
  onAdd: (title: string, description?: string) => void;
  loading?: boolean;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (description && description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onAdd(title.trim(), description.trim() || undefined);

    // Reset form
    setTitle('');
    setDescription('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6" role="form" aria-label="Add new todo form">
      <h2 className="text-xl font-semibold mb-4 text-gray-800" id="add-todo-heading">Add New Todo</h2>

      <Input
        label="Title *"
        id="todo-title"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
        aria-describedby={errors.title ? "title-error" : undefined}
      />

      <div className="mb-4">
        <label htmlFor="todo-description" className="block text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="todo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          placeholder="Add details..."
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        variant="primary"
        className="w-full"
        aria-describedby={Object.keys(errors).length > 0 ? "form-errors" : undefined}
      >
        {loading ? 'Adding...' : 'Add Todo'}
      </Button>

      {Object.keys(errors).length > 0 && (
        <div id="form-errors" className="sr-only" role="alert">
          Form has errors. Please correct the highlighted fields.
        </div>
      )}
    </form>
  );
};

export default AddTodoForm;