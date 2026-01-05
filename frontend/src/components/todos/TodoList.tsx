"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useTodosQuery } from "@/hooks/useTodos"
import TodoItem from "./TodoItem"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Search, FilterX } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useTodosQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filteredTodos = useMemo(() => {
    if (!todos) return []
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))

      if (filter === "active") return matchesSearch && !todo.completed
      if (filter === "completed") return matchesSearch && todo.completed
      return matchesSearch
    })
  }, [todos, searchTerm, filter])

  if (isLoading)
    return (
      <div className="flex py-20 justify-center">
        <Spinner fontSize={16} />
      </div>
    )
  if (error)
    return (
      <div className="text-destructive p-4 border border-destructive/20 bg-destructive/5 rounded-lg text-sm">
        Error loading todos: {error.message}
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/30 border-none h-10 focus-visible:ring-1"
          />
        </div>
        <Tabs value={filter} onValueChange={(v: string) => setFilter(v as any)} className="w-auto">
          <TabsList className="bg-muted/30 h-10">
            <TabsTrigger value="all" className="data-[state=active]:bg-background">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-background">
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-background">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed bg-muted/10">
            <FilterX className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No tasks found</p>
            <p className="text-sm text-muted-foreground/60">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoList
