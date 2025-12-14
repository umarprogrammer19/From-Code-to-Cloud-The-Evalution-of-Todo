import React from 'react';
import { useTodoStatsQuery } from '@/hooks/useTodos';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TodoStats: React.FC = () => {
  const { data: stats, isLoading, error } = useTodoStatsQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error loading stats: {error.message}</div>;
  }

  if (!stats) {
    return <div className="text-center py-4 text-gray-500">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6 p-4 border rounded-lg bg-white">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
        <div className="text-sm text-gray-600">Active</div>
      </div>
    </div>
  );
};

export default TodoStats;