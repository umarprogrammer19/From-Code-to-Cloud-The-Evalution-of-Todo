import React from 'react';

interface TodoStatsProps {
  total: number;
  completed: number;
  active: number;
}

const TodoStats: React.FC<TodoStatsProps> = ({ total, completed, active }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Todo Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-green-800">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{completed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="text-lg font-medium text-yellow-800">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{active}</p>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Progress: {total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
            <span>{completed} of {total} completed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoStats;