"use client"

import { useState, useEffect } from "react"
import { createTask, updateTask } from "@/services/api"
import { Task, TaskCreate, TaskUpdate } from "../types/task"
import { useToast } from './ToastProvider';
import { motion } from "framer-motion";

// Helper function to normalize task to ensure categories is always an array
function normalizeTask(task: Task): Task {
  return {
    ...task,
    categories: Array.isArray(task.categories) ? task.categories : (task.categories || []),
  };
}

interface TaskFormProps {
    refreshTasks: () => void;
    editingTask?: Task;
    onCloseEdit?: () => void;
}

export default function TaskForm({ refreshTasks, editingTask, onCloseEdit }: TaskFormProps) {
    const [title, setTitle] = useState(editingTask?.title || "")
    const [description, setDescription] = useState(editingTask?.description || "")
    const [dueDate, setDueDate] = useState<string>(
        editingTask?.due_date ? new Date(editingTask.due_date).toISOString().slice(0, 16) : ""
    )
    const [priority, setPriority] = useState<TaskCreate['priority']>(editingTask?.priority || "medium")
    const [categories, setCategories] = useState(editingTask?.categories ? editingTask.categories.join(", ") : "")
    const [isRecurring, setIsRecurring] = useState(editingTask?.is_recurring || false)
    const [recurrencePattern, setRecurrencePattern] = useState<TaskCreate['recurrence_pattern']>(editingTask?.recurrence_pattern || "daily")

    const { addToast } = useToast();

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title)
            setDescription(editingTask.description || "")
            setDueDate(editingTask.due_date ? new Date(editingTask.due_date).toISOString().slice(0, 16) : "")
            setPriority(editingTask.priority || "medium")
            setCategories(editingTask.categories ? editingTask.categories.join(", ") : "")
            setIsRecurring(editingTask.is_recurring || false)
            setRecurrencePattern(editingTask.recurrence_pattern || "daily")
        } else {
            setTitle("")
            setDescription("")
            setDueDate("")
            setPriority("medium")
            setCategories("")
            setIsRecurring(false)
            setRecurrencePattern("daily")
        }
    }, [editingTask])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const categoryArray = categories ? categories.split(',').map(cat => cat.trim()).filter(cat => cat !== '') : [];

        try {
            if (editingTask) {
                const updatedTaskData: TaskUpdate = {
                    title,
                    description: description || undefined,
                    due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
                    priority,
                    status: editingTask.status, // Preserve the current status
                    categories: categoryArray,
                    is_recurring: isRecurring,
                    recurrence_pattern: isRecurring ? recurrencePattern : undefined,
                }
                const updatedTask = await updateTask(editingTask.id, updatedTaskData);
                if (!updatedTask) {
                    throw new Error("Failed to update task: API returned no data");
                }
                refreshTasks();
                addToast("Task updated successfully!", "success");
                if (onCloseEdit) onCloseEdit();
            } else {
                const newTaskData: TaskCreate = {
                    title,
                    description: description || undefined,
                    due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
                    priority,
                    categories: categoryArray,
                    is_recurring: isRecurring,
                    recurrence_pattern: isRecurring ? recurrencePattern : undefined,
                    status: 'pending'
                }
                const createdTask = await createTask(newTaskData);
                if (!createdTask) {
                    throw new Error("Failed to create task: API returned no data");
                }
                refreshTasks();
                addToast("Task added successfully!", "success");
            }

            setTitle("")
            setDescription("")
            setDueDate("")
            setPriority("medium")
            setCategories("")
            setIsRecurring(false)
            setRecurrencePattern("daily")
        } catch (error: any) {
            addToast(`Error: ${error.message}`, "error");
        }
    }

    const inputClasses = "block w-full input-field p-3 text-white placeholder:text-gray-400 focus:outline-none transition-all duration-300";

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 card p-6"
        >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-6">
                {editingTask ? "Edit Task" : "Add New Task"}
            </h2>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Complete project proposal"
                    required
                    className={inputClasses}
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add detailed description..."
                    className={`${inputClasses} min-h-[100px] resize-none`}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                    <input
                        type="datetime-local"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskCreate['priority'])}
                        className={inputClasses}
                    >
                        <option value="low" className="bg-gray-800">Low</option>
                        <option value="medium" className="bg-gray-800">Medium</option>
                        <option value="high" className="bg-gray-800">High</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                <input
                    type="text"
                    id="categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="e.g. Work, Personal, Urgent (comma separated)"
                    className={inputClasses}
                />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <input
                    id="isRecurring"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-5 w-5 rounded text-emerald-500 focus:ring-emerald-500 bg-gray-700 border-gray-600"
                />
                <label htmlFor="isRecurring" className="text-sm font-medium text-gray-300">Recurring Task</label>
            </div>

            {isRecurring && (
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-300 mb-2">Recurrence Pattern</label>
                    <select
                        id="recurrencePattern"
                        value={recurrencePattern}
                        onChange={(e) => setRecurrencePattern(e.target.value as TaskCreate['recurrence_pattern'])}
                        className={inputClasses}
                    >
                        <option value="daily" className="bg-gray-800">Daily</option>
                        <option value="weekly" className="bg-gray-800">Weekly</option>
                        <option value="monthly" className="bg-gray-800">Monthly</option>
                    </select>
                </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-4">
                {editingTask && (
                    <button
                        type="button"
                        onClick={onCloseEdit}
                        className="btn btn-outline px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary px-6 py-3 rounded-lg font-semibold"
                >
                    {editingTask ? "Update Task" : "Add Task"}
                </button>
            </div>
        </motion.form>
    )
}
