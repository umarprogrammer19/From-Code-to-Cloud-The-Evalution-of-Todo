import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'better-auth/react';
import DashboardPage from './dashboard';

// Mock the better-auth client
jest.mock('better-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      }
    },
    isPending: false
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock the router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    asPath: '/dashboard'
  })
}));

// Mock the API hooks
jest.mock('@/hooks/useTodos', () => ({
  useTodosQuery: () => ({
    data: [],
    isLoading: false,
    error: null
  }),
  useTodoStatsQuery: () => ({
    data: { total: 0, completed: 0, active: 0 },
    isLoading: false
  }),
  useCreateTodoMutation: () => ({
    mutate: jest.fn(),
    isPending: false
  }),
  useToggleTodoCompletionMutation: () => ({
    mutate: jest.fn()
  }),
  useDeleteTodoMutation: () => ({
    mutate: jest.fn()
  })
}));

// Mock the components
jest.mock('@/components/ui/Layout', () => {
  return ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div data-testid="layout">
      <h1>{title}</h1>
      {children}
    </div>
  );
});

jest.mock('@/components/todos/TodoFilter', () => {
  return ({ onFilterChange, onSearchChange }: any) => (
    <div data-testid="todo-filter">
      <input
        type="text"
        placeholder="Search todos..."
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button onClick={() => onFilterChange('all')}>All</button>
      <button onClick={() => onFilterChange('active')}>Active</button>
      <button onClick={() => onFilterChange('completed')}>Completed</button>
    </div>
  );
});

jest.mock('@/components/todos/TodoList', () => {
  return ({ todos, loading, onToggle, onDelete }: any) => (
    <div data-testid="todo-list">
      {loading ? (
        <div>Loading...</div>
      ) : todos.length === 0 ? (
        <div>No todos</div>
      ) : (
        todos.map((todo: any) => (
          <div key={todo.id} data-testid={`todo-item-${todo.id}`}>
            <span>{todo.title}</span>
            <button onClick={() => onToggle(todo.id, !todo.completed)}>
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
});

jest.mock('@/components/todos/AddTodoForm', () => {
  return ({ onAdd, loading }: any) => (
    <form data-testid="add-todo-form">
      <input type="text" id="todo-title" placeholder="Title" />
      <textarea id="todo-description" placeholder="Description" />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          const titleInput = document.getElementById('todo-title') as HTMLInputElement;
          const descInput = document.getElementById('todo-description') as HTMLTextAreaElement;
          onAdd(titleInput.value, descInput.value);
        }}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
});

jest.mock('@/components/todos/TodoStats', () => {
  return ({ total, completed, active }: any) => (
    <div data-testid="todo-stats">
      <div>Total: {total}</div>
      <div>Completed: {completed}</div>
      <div>Active: {active}</div>
    </div>
  );
});

describe('DashboardPage Integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Prevent retries in tests
      },
    },
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {ui}
        </SessionProvider>
      </QueryClientProvider>
    );
  };

  it('renders dashboard with welcome message', async () => {
    renderWithProviders(<DashboardPage />);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('Manage your tasks efficiently')).toBeInTheDocument();
  });

  it('renders stats section', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('todo-stats')).toBeInTheDocument();
    });

    expect(screen.getByText('Total: 0')).toBeInTheDocument();
    expect(screen.getByText('Completed: 0')).toBeInTheDocument();
    expect(screen.getByText('Active: 0')).toBeInTheDocument();
  });

  it('renders add todo form', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('add-todo-form')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('renders filter section', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('todo-filter')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders empty todo list message', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    });

    expect(screen.getByText('No todos')).toBeInTheDocument();
  });

  it('allows adding a new todo', async () => {
    const mockCreateTodo = jest.fn();
    jest.mock('@/hooks/useTodos', () => ({
      useTodosQuery: () => ({
        data: [],
        isLoading: false,
        error: null
      }),
      useTodoStatsQuery: () => ({
        data: { total: 0, completed: 0, active: 0 },
        isLoading: false
      }),
      useCreateTodoMutation: () => ({
        mutate: mockCreateTodo,
        isPending: false
      }),
      useToggleTodoCompletionMutation: () => ({
        mutate: jest.fn()
      }),
      useDeleteTodoMutation: () => ({
        mutate: jest.fn()
      })
    }));

    // Re-import the component to use the updated mock
    const { default: DashboardPageWithMock } = await import('./dashboard');

    renderWithProviders(<DashboardPageWithMock />);

    await waitFor(() => {
      expect(screen.getByTestId('add-todo-form')).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText('Title');
    const addButton = screen.getByText('Add Todo');

    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'New Todo',
        description: undefined,
        completed: false
      });
    });
  });
});