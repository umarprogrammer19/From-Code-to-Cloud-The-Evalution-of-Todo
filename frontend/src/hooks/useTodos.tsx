import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
  getTodoStats
} from '@/services/todos';
import { Todo } from '@/types';
import { toast } from 'sonner';

export const useTodosQuery = () => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTodoStatsQuery = () => {
  return useQuery({
    queryKey: ['todo-stats'],
    queryFn: getTodoStats,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onMutate: () => {
      toast.loading('Adding task...', { id: 'add-task' });
    },
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
      toast.success('Task added successfully!', { id: 'add-task' });
    },
    onError: (error) => {
      toast.error('Failed to add task', {
        id: 'add-task',
        description: error.message || 'An error occurred while adding the task'
      });
    },
  });
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Todo> }) => updateTodo(id, data),
    onMutate: () => {
      toast.loading('Updating task...', { id: 'update-task' });
    },
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
      toast.success('Task updated successfully!', { id: 'update-task' });
    },
    onError: (error) => {
      toast.error('Failed to update task', {
        id: 'update-task',
        description: error.message || 'An error occurred while updating the task'
      });
    },
  });
};

export const useToggleTodoCompletionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => toggleTodoCompletion(id, completed),
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update the todo
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        ) || []
      );

      // Show loading toast
      toast.loading(completed ? 'Completing task...' : 'Marking task as incomplete...', { id: 'toggle-completion' });

      // Return context object with snapshotted value
      return { previousTodos };
    },
    onSuccess: (_, { completed }) => {
      toast.success(completed ? 'Task completed!' : 'Task marked as incomplete!', { id: 'toggle-completion' });
    },
    onError: (err, { completed }, context) => {
      // Rollback to previous value on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }

      toast.error('Failed to update task status', {
        id: 'toggle-completion',
        description: err.message || 'An error occurred while updating the task status'
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
    },
  });
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id: number) => {
      // Cancel outgoing refetches to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically remove the todo
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.filter(todo => todo.id !== id) || []
      );

      // Show loading toast
      toast.loading('Deleting task...', { id: 'delete-task' });

      // Return context object with snapshotted value
      return { previousTodos };
    },
    onSuccess: () => {
      toast.success('Task deleted successfully!', { id: 'delete-task' });
    },
    onError: (err, id, context) => {
      // Rollback to previous value on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }

      toast.error('Failed to delete task', {
        id: 'delete-task',
        description: err.message || 'An error occurred while deleting the task'
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
    },
  });
};