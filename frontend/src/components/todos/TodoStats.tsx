"use client"

import { useTodoStatsQuery } from "@/hooks/useTodos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ListTodo, Timer } from "lucide-react"

interface TodoStats {
  total: number
  completed: number
  active: number
}

const TodoStats = () => {
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
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      title: "Active",
      value: stats.active,
      icon: Timer,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statCards.map((stat) => (
        <Card
          key={stat.title}
          className="overflow-hidden border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">tasks tracked</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TodoStats
