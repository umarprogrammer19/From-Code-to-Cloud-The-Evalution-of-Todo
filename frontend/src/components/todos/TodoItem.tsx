"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2, Save, X } from "lucide-react"
import { useState } from "react"
import { useToggleTodoCompletionMutation, useDeleteTodoMutation, useUpdateTodoMutation } from "@/hooks/useTodos"
import { format } from "date-fns"
import { Todo } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [editPriority, setEditPriority] = useState(todo.priority)

  const { mutate: handleToggle, isPending: toggleMutationIsPending } = useToggleTodoCompletionMutation()
  const { mutate: handleDelete, isPending: deleteMutationIsPending } = useDeleteTodoMutation()
  const { mutate: handleUpdate, isPending: updateMutationIsPending } = useUpdateTodoMutation()

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30';
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      case 'urgent':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/30';
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "yyyy-MM-dd")
  }

  const handleToggleCompletion = () => {
    handleToggle({ id: todo.id, completed: !todo.completed });
  };

  const handleDeleteTodo = () => {
    handleDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority);
  };

  const handleSave = () => {
    handleUpdate({
      id: todo.id,
      data: {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority as 'low' | 'medium' | 'high' | 'urgent'
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <Card className="p-4 border border-border/60 bg-card">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="font-semibold text-base bg-background border border-border/60 rounded-lg h-10 focus-visible:ring-2 focus-visible:ring-primary/50"
            autoFocus
            disabled={updateMutationIsPending}
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add description..."
            className="min-h-20 resize-none bg-background border border-border/60 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50"
            disabled={updateMutationIsPending}
          />
          <div className="flex items-center gap-2">
            <Select
              value={editPriority}
              onValueChange={(v: "low" | "medium" | "high" | "urgent") => setEditPriority(v)}
              disabled={updateMutationIsPending}
            >
              <SelectTrigger className="w-32 bg-background border border-border/60 rounded-lg h-8 focus-visible:ring-2 focus-visible:ring-primary/50">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1 ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutationIsPending}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateMutationIsPending || !editTitle.trim()}
                className="h-8 w-8 p-0"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`group relative flex items-center gap-4 p-4 border border-border/60 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md ${todo.completed ? "opacity-70 bg-muted/30" : ""}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleCompletion}
          className="h-5 w-5 rounded border-primary/50"
          disabled={toggleMutationIsPending}
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
            className={`px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-bold border rounded-md ${getPriorityColor(todo.priority)}`}
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
              className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded-lg"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-lg border border-border/60">
            <DropdownMenuItem onClick={handleEdit} className="rounded-md cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteTodo}
              className="text-destructive focus:text-destructive rounded-md cursor-pointer"
              disabled={deleteMutationIsPending}
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
