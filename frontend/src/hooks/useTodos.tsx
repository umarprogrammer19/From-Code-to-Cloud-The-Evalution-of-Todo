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

export const useTodosQuery = () => {
  return useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTodoStatsQuery = () => {
  return useQuery({
    queryKey: ['todo-stats'],
    queryFn: getTodoStats,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 60 * 1000, // 1 minute
  });
};

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
    },
  });
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Todo> }) => updateTodo(id, data),
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
    },
  });
};

export const useToggleTodoCompletionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => toggleTodoCompletion(id, completed),
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

      // Return context object with snapshotted value
      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
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
    onMutate: async (id) => {
      // Cancel outgoing refetches to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically remove the todo
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.filter(todo => todo.id !== id) || []
      );

      // Return context object with snapshotted value
      return { previousTodos };
    },
    onError: (err, id, context) => {
      // Rollback to previous value on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo-stats'] });
    },
  });
};