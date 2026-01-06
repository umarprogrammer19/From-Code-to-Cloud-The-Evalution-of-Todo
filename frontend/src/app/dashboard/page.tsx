"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { LayoutDashboard } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import TodoStats from "@/components/todos/TodoStats"
import TodoList from "@/components/todos/TodoList"
import AddTodoForm from "@/components/todos/AddTodoForm"

const DashboardPage = () => {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  if (isPending) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Spinner fontSize={16} />
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Manage your tasks and track your productivity.</p>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-secondary/10 text-primary sm:flex">
          <LayoutDashboard className="h-6 w-6" />
        </div>
      </div>

      <TodoStats />

      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
        <div className="order-2 lg:order-1">
          <TodoList />
        </div>
        <div className="order-1 lg:order-2">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-xl font-semibold">Quick Add</h2>
            <AddTodoForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
