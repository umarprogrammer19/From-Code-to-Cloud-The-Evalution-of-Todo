"use client";

import { useState } from "react";
import { deleteTask, toggleTaskCompletion } from "@/services/api";
import { Task } from "../types/task";
import TaskForm from "./TaskForm";
import { useToast } from './ToastProvider';
import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";
import { motion } from "framer-motion";

interface TaskCardProps {
    task: Task;
    refreshTasks: () => void;
    onSelectToggle?: (taskId: string) => void;
    isSelected?: boolean;
}

export default function TaskCard({ task, refreshTasks, onSelectToggle, isSelected }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { addToast } = useToast();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(task.id);
                addToast("Task deleted successfully!", "success");
                refreshTasks();
            } catch (error: any) {
                addToast(`Error deleting task: ${error.message}`, "error");
            }
        }
    };

    const handleToggleComplete = async () => {
        try {
            await toggleTaskCompletion(task.id);
            addToast(`Task marked ${task.status === 'completed' ? 'pending' : 'completed'}!`, "success");
            refreshTasks();
        } catch (error: any) {
            addToast(`Error updating task status: ${error.message}`, "error");
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Define priority colors for the new aesthetic
    const priorityColors = {
        high: 'bg-red-500/20 text-red-400 border-red-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
                relative p-6 card mb-4 transition-all duration-300
                hover:-translate-y-1
                ${task.status === 'completed' ? 'opacity-70 grayscale' : ''}
                overflow-hidden
            `}
        >
            {/* Decorative accent line */}
            <div className={`
                absolute top-0 left-0 h-1 w-full
                ${task.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  task.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-r from-emerald-500 to-emerald-600'}
            `}></div>

            {isEditing ? (
                <TaskForm
                    refreshTasks={() => {
                        setIsEditing(false);
                        refreshTasks();
                    }}
                    editingTask={task}
                    onCloseEdit={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-grow">
                            {onSelectToggle && (
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onSelectToggle(task.id)}
                                    className="mt-1 form-checkbox h-5 w-5 text-emerald-500 rounded focus:ring-emerald-500 border-gray-600 bg-gray-700"
                                />
                            )}
                            <div className="flex-grow">
                                <h3 className={`text-xl font-bold mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                        {task.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-lg bg-gray-700/50 hover:bg-emerald-600/20 transition-colors border border-gray-600 hover:border-emerald-500/50"
                            >
                                <EditIcon className="w-4 h-4 text-gray-300 hover:text-emerald-400" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 rounded-lg bg-gray-700/50 hover:bg-red-600/20 transition-colors border border-gray-600 hover:border-red-500/50"
                            >
                                <DeleteIcon className="w-4 h-4 text-gray-300 hover:text-red-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-700/30">
                        {task.due_date && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">📅</span>
                                <span>{formatDate(task.due_date)}</span>
                            </div>
                        )}
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                            {task.priority}
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={handleToggleComplete}
                                className="form-checkbox h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 border-gray-600 bg-gray-700"
                            />
                            <span className={`capitalize ${task.status === 'completed' ? 'text-emerald-400' : 'text-gray-300'}`}>
                                {task.status}
                            </span>
                        </div>
                    </div>

                    {task.categories && Array.isArray(task.categories) && task.categories.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {task.categories.map((cat, index) => {
                                if (!cat) return null; // Skip if cat is null/undefined
                                return (
                                    <span
                                        key={`${task.id}-${index}`} // Using task.id and index as key to ensure uniqueness
                                        className="inline-block bg-gray-700/30 rounded-lg px-3 py-1 text-xs font-medium text-gray-300 border border-gray-600/50"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        #{cat}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </motion.div>
    )
}
