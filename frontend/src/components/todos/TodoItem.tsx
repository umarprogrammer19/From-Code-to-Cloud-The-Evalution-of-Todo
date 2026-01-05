"use client"

import type React from "react"
import { useState } from "react"
import { useToggleTodoCompletionMutation, useDeleteTodoMutation, useUpdateTodoMutation } from "@/hooks/useTodos"
import type { Todo } from "@/types"
import { formatDate } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, X, Check, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TodoItemProps {
  todo: Todo
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high" | "urgent">(todo.priority)

  const toggleMutation = useToggleTodoCompletionMutation()
  const deleteMutation = useDeleteTodoMutation()
  const updateMutation = useUpdateTodoMutation()

  const handleToggle = () => toggleMutation.mutate({ id: todo.id, completed: !todo.completed })
  const handleDelete = () => deleteMutation.mutate(todo.id)
  const handleSave = () => {
    updateMutation.mutate({
      id: todo.id,
      data: { title: editTitle, description: editDescription, priority: editPriority },
    })
    setIsEditing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
      case "urgent":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  if (isEditing) {
    return (
      <Card className="p-4 border-primary/20 bg-primary/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-medium h-10 border-none bg-background focus-visible:ring-1"
            placeholder="Task title"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="text-sm min-h-20 border-none bg-background focus-visible:ring-1 resize-none"
            placeholder="Task description"
          />
          <div className="flex items-center justify-between gap-4">
            <Select value={editPriority} onValueChange={(v) => setEditPriority(v as any)}>
              <SelectTrigger className="w-35 h-9 border-none bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-9">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="h-9 px-4">
                <Check className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`group relative flex items-center gap-4 p-4 border-none bg-muted/30 transition-all hover:bg-muted/50 ${todo.completed ? "opacity-60" : ""}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          className="h-5 w-5 rounded-full"
          disabled={toggleMutation.isPending}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3
            className={`text-base font-semibold truncate ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
            {todo.title}
          </h3>
          <Badge
            variant="outline"
            className={`px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-bold border ${getPriorityColor(todo.priority)}`}
          >
            {todo.priority}
          </Badge>
        </div>

        {todo.description && <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{todo.description}</p>}

        <div className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
          Updated {formatDate(todo.updatedAt)}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

export default TodoItem
