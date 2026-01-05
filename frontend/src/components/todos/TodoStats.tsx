"use client"

import type React from "react"
import { useTodoStatsQuery } from "@/hooks/useTodos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ListTodo, Timer } from "lucide-react"

const TodoStats: React.FC = () => {
  const { data: stats, isLoading, error } = useTodoStatsQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-muted/50 h-32" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm">
        Error loading stats: {error.message}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    { title: "Total Tasks", value: stats.total, icon: ListTodo, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Active", value: stats.active, icon: Timer, color: "text-orange-500", bg: "bg-orange-500/10" },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.title} className="overflow-hidden border-none bg-muted/30 transition-all hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TodoStats
