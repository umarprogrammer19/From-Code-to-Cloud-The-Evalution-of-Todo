import React, { useState, useMemo } from 'react';
import { useTodosQuery } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Todo } from '@/types';

const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useTodosQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Filter and search logic - must be called before any conditional returns
  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    return todos.filter(todo => {
      // Apply search filter
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Apply status filter
      if (filter === 'active') {
        return matchesSearch && !todo.completed;
      } else if (filter === 'completed') {
        return matchesSearch && todo.completed;
      } else {
        return matchesSearch;
      }
    });
  }, [todos, searchTerm, filter]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error loading todos: {error.message}</div>;
  }

  if (!todos || todos.length === 0) {
    return <div className="text-center py-8 text-gray-500">No todos found. Add a new todo to get started!</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredTodos.length} of {todos?.length || 0} todos
      </div>

      {/* Todo Items */}
      <div className="space-y-2">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No todos match your search and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;