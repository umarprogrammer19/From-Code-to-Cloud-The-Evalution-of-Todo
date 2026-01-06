"use client"

import type React from "react"
import { useState } from "react"
import { useCreateTodoMutation } from "@/hooks/useTodos"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

const AddTodoForm: React.FC = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")

  const createMutation = useCreateTodoMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
    })

    setTitle("")
    setDescription("")
    setPriority("medium")
  }

  return (
    <Card className="overflow-hidden border bg-muted/30">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="bg-background border focus-visible:ring-2 focus-visible:ring-ring"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="min-h-25 resize-none bg-background border focus-visible:ring-2 focus-visible:ring-ring"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Priority</label>
            <Select value={priority} onValueChange={(v: "low" | "medium" | "high" | "urgent") => setPriority(v)} disabled={createMutation.isPending}>
              <SelectTrigger className="bg-background border">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={createMutation.isPending || !title.trim()}
            className="w-full shadow-lg shadow-primary/20"
          >
            {createMutation.isPending ? (
              "Adding..."
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddTodoForm
