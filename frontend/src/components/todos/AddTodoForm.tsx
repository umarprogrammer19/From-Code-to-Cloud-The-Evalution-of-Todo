"use client"

import type React from "react"
import { useState } from "react"
import { useCreateTodoMutation } from "@/hooks/useTodos"
import { Button } from "@/components/ui/Buttons"
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
    <Card className="overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-all duration-300 shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Task Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="bg-card border border-border/60 rounded-lg h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="min-h-24 resize-none bg-card border border-border/60 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Priority</label>
            <Select
              value={priority}
              onValueChange={(v: "low" | "medium" | "high" | "urgent") => setPriority(v)}
              disabled={createMutation.isPending}
            >
              <SelectTrigger className="bg-card border border-border/60 rounded-lg h-11 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all">
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
            className="w-full rounded-lg shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
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
