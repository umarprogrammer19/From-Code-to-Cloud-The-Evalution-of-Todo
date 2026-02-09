"use client"

import TaskCard from "./TaskCard"
import { Task } from "../types/task";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
    tasks: Task[];
    refreshTasks: () => void;
    selectedTaskIds: string[];
    onSelectedTasksChange: (selectedIds: string[]) => void;
}

export default function TaskList({ tasks, refreshTasks, selectedTaskIds, onSelectedTasksChange }: TaskListProps) {

    const handleSelectToggle = (taskId: string) => {
        const newSelected = selectedTaskIds.includes(taskId)
            ? selectedTaskIds.filter(id => id !== taskId)
            : [...selectedTaskIds, taskId];
        onSelectedTasksChange(newSelected);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allTaskIds = tasks && Array.isArray(tasks) ? tasks.map(task => task.id) : [];
            onSelectedTasksChange(allTaskIds);
        } else {
            onSelectedTasksChange([]);
        }
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg"
            >
                <input
                    type="checkbox"
                    checked={selectedTaskIds.length === tasks.length && tasks.length > 0}
                    onChange={handleSelectAll}
                    className="form-checkbox h-5 w-5 text-emerald-500 rounded focus:ring-emerald-500 border-gray-600 bg-gray-700"
                />
                <label className="text-sm text-gray-300">
                    Select All ({selectedTaskIds.length} selected)
                </label>
                <div className="ml-auto text-sm text-gray-400">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </div>
            </motion.div>

            <AnimatePresence>
                {tasks && Array.isArray(tasks) && tasks.map(task => (
                    <motion.div
                        key={`motion-${task.id}`}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TaskCard
                            key={`card-${task.id}`}
                            task={task}
                            refreshTasks={refreshTasks}
                            onSelectToggle={handleSelectToggle}
                            isSelected={selectedTaskIds.includes(task.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {tasks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                >
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-xl font-medium text-gray-400 mb-2">No tasks found</h3>
                    <p className="text-gray-500">Create your first task to get started</p>
                </motion.div>
            )}
        </div>
    )
}