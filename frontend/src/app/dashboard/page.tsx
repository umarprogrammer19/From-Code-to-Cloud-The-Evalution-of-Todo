'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from '@/components/task/task-card';
import { FilterDropdown } from '@/components/task/filter-dropdown';
import { SortDropdown } from '@/components/task/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

// Mock task data for demonstration
const mockTasks = [
  { id: '1', title: 'Complete project proposal', completed: false, priority: 'high', createdAt: new Date() },
  { id: '2', title: 'Schedule team meeting', completed: true, priority: 'medium', createdAt: new Date() },
  { id: '3', title: 'Review documentation', completed: false, priority: 'low', createdAt: new Date() },
];

export default function DashboardPage() {
  const { data: session, isLoading: isPending } = useSession();
  const router = useRouter();

  // If still loading the session, show nothing or a loading state
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If no session, redirect to login
  if (!session) {
    router.push('/login');
    return null; // Return null to prevent rendering
  }

  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sort, setSort] = useState<'date' | 'priority' | 'title'>('date');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else if (sort === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const handleTaskComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTaskDelete = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex space-x-4">
        <FilterDropdown currentFilter={filter} onFilterChange={setFilter} />
        <SortDropdown currentSort={sort} onSortChange={setSort} />
      </div>

      <div className="grid gap-4">
        {sortedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
          />
        ))}
      </div>

      {sortedTasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No tasks found. Create your first task!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}