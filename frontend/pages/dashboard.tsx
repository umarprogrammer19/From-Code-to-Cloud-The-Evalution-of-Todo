import React, { useState } from 'react';
import { useSession } from 'better-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/ui/Layout';
import TodoFilter from '@/components/todos/TodoFilter';
import TodoList from '@/components/todos/TodoList';
import AddTodoForm from '@/components/todos/AddTodoForm';
import TodoStats from '@/components/todos/TodoStats';
import {
  useTodosQuery,
  useTodoStatsQuery,
  useCreateTodoMutation,
  useToggleTodoCompletionMutation,
  useDeleteTodoMutation
} from '@/hooks/useTodos';
import { Todo } from '@/types';

const DashboardPage: React.FC = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <Layout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null; // Redirect effect will handle this
  }

  // Fetch todos and stats
  const { data: todos = [], isLoading: todosLoading, error: todosError } = useTodosQuery();
  const { data: stats, isLoading: statsLoading } = useTodoStatsQuery();

  // Apply filter and search
  const filteredTodos = todos.filter(todo => {
    // Apply search filter
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Apply status filter
    if (filter === 'active') {
      return !todo.completed && matchesSearch;
    } else if (filter === 'completed') {
      return todo.completed && matchesSearch;
    }
    return matchesSearch;
  });

  // Mutations
  const createTodoMutation = useCreateTodoMutation();
  const toggleTodoMutation = useToggleTodoCompletionMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  const handleAddTodo = (title: string, description?: string) => {
    createTodoMutation.mutate({
      title,
      description,
      completed: false
    });
  };

  const handleToggleTodo = (id: string, completed: boolean) => {
    toggleTodoMutation.mutate({ id, completed });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  return (
    <Layout title="Dashboard">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user.name || session.user.email}</h1>
          <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
        </div>

        {/* Stats - only show if available */}
        {stats && !statsLoading && (
          <TodoStats
            total={stats.total}
            completed={stats.completed}
            active={stats.active}
          />
        )}

        {/* Add Todo Form */}
        <AddTodoForm
          onAdd={handleAddTodo}
          loading={createTodoMutation.isPending}
        />

        {/* Filter and Search */}
        <TodoFilter
          onFilterChange={setFilter}
          onSearchChange={setSearchTerm}
        />

        {/* Todo List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {filter === 'all' ? 'All Tasks' :
             filter === 'active' ? 'Active Tasks' : 'Completed Tasks'}
            <span className="text-gray-500 text-base font-normal ml-2">({filteredTodos.length})</span>
          </h2>

          <TodoList
            todos={filteredTodos}
            loading={todosLoading}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;