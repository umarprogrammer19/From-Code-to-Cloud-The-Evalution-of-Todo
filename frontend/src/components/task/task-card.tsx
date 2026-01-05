'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const handleComplete = () => {
    onComplete(task.id);
    toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
  };

  const handleDelete = () => {
    onDelete(task.id);
    toast.success('Task deleted');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`transition-all ${task.completed ? 'opacity-70' : ''}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleComplete}
            className="mt-1"
          />
          <div className="flex-1">
            <p className={`truncate ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Priority: {task.priority}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}