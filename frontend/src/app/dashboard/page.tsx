"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import TaskList from "@/app/components/TaskList"
import TaskForm from "@/app/components/TaskForm"
import SearchBar from "@/app/components/SearchBar"
import BulkActions from "@/app/components/BulkActions"
import { getTasks, ApiError } from "@/services/api"
import { Task } from "@/app/types/task"
import FilterDropdown from "@/app/components/FilterDropdown"
import { getStoredJwt } from "@/services/authService"; // Import getStoredJwt
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import { motion } from "framer-motion"
import DarkModeToggle from "@/app/components/DarkModeToggle";
import { ToastProvider } from "@/app/components/ToastProvider";
import Link from "next/link"
import FloatingChatWidget from "@/app/components/FloatingChatWidget";

// Helper function to normalize task to ensure categories is always an array
function normalizeTask(task: Task): Task {
  return {
    ...task,
    categories: Array.isArray(task.categories) ? task.categories : (task.categories || []),
  };
}

// Helper function to normalize an array of tasks
function normalizeTasks(tasks: Task[]): Task[] {
  return tasks.map(normalizeTask);
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [filterParams, setFilterParams] = useState<{ status?: string; priority?: string }>({})
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        const token = getStoredJwt();
        if (token) {
            try {
                const decoded: { sub: string } = jwtDecode(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("Invalid token:", error);
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchTasks = useCallback(async () => {
        if (userId) {
            try {
                const fetchedTasks = await getTasks()
                console.log("Fetched tasks:", fetchedTasks);
                setTasks(Array.isArray(fetchedTasks) ? normalizeTasks(fetchedTasks) : []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                if (error instanceof ApiError && error.status === 404) {
                    localStorage.removeItem("user_id");
                    router.push("/login");
                }
            }
        }
    }, [userId, router])

    useEffect(() => {
        if (userId) {
            fetchTasks()
        }
    }, [userId, fetchTasks])

    const handleSearch = (query: string) => {
        setSearchTerm(query)
    }

    const handleFilterChange = (filters: { status?: string; priority?: string }) => {
        setFilterParams(filters)
    }

    const handleSelectedTasksChange = (selectedIds: string[]) => {
        setSelectedTaskIds(selectedIds)
    }

    const clearSelectedTasks = () => {
        setSelectedTaskIds([])
    }

    const filteredTasks = normalizeTasks(tasks)
        .filter(task => {
            const searchTermLower = searchTerm.toLowerCase();
            return task.title.toLowerCase().includes(searchTermLower) || task.description?.toLowerCase().includes(searchTermLower)
        })
        .filter(task => {
            if (filterParams.status && task.status !== filterParams.status) {
                return false;
            }
            if (filterParams.priority && task.priority !== filterParams.priority) {
                return false;
            }
            return true;
        })

    if (!userId) {
        return <div className="flex justify-center items-center h-screen">Loading user session...</div>
    }

    return (
        <ToastProvider>
            <motion.main
                className="bg-gradient-to-br from-gray-900 via-emerald-900/5 to-black min-h-screen text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 -right-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 container mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Header with controls */}
                    <motion.header
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-4">
                            <Link href={"/"}>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                                    Task Dashboard
                                </h1>
                            </Link>
                            <div className="text-sm text-gray-400 mt-1">
                                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <DarkModeToggle />
                        </div>
                    </motion.header>

                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="lg:col-span-1">
                            <motion.div
                                className="sticky top-8"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <TaskForm refreshTasks={fetchTasks} />
                            </motion.div>
                        </div>
                        <div className="lg:col-span-2">
                            <motion.div
                                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="w-full sm:w-auto flex-grow">
                                    <SearchBar onSearch={handleSearch} />
                                </div>
                                <FilterDropdown onFilterChange={handleFilterChange} />
                            </motion.div>

                            {selectedTaskIds.length > 0 && (
                                <motion.div
                                    className="mb-6"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <BulkActions
                                        selectedTaskIds={selectedTaskIds}
                                        refreshTasks={() => {
                                            fetchTasks();
                                            clearSelectedTasks();
                                        }}
                                        clearSelection={clearSelectedTasks}
                                    />
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <TaskList
                                    tasks={filteredTasks}
                                    refreshTasks={fetchTasks}
                                    selectedTaskIds={selectedTaskIds}
                                    onSelectedTasksChange={handleSelectedTasksChange}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Chat Widget */}
                <FloatingChatWidget />
            </motion.main>
        </ToastProvider>
    )
}