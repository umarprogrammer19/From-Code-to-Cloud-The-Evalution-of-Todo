import React from 'react';
import { useTodosQuery } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Todo } from '@/types';

const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useTodosQuery();

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
    <div className="space-y-2">
      {todos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;