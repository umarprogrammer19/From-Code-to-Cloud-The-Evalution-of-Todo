import React, { useState } from 'react';
import { useCreateTodoMutation } from '@/hooks/useTodos';
import { Button } from '@/components/ui/Button';

const AddTodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const createMutation = useCreateTodoMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-white">
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full p-3 border rounded text-lg"
          disabled={createMutation.isPending}
        />
      </div>
      <div className="mb-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          className="w-full p-3 border rounded"
          rows={2}
          disabled={createMutation.isPending}
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
          className="w-full p-2 border rounded"
          disabled={createMutation.isPending}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <Button
        type="submit"
        disabled={createMutation.isPending || !title.trim()}
        className="w-full"
      >
        {createMutation.isPending ? 'Adding...' : 'Add Todo'}
      </Button>
    </form>
  );
};

export default AddTodoForm;