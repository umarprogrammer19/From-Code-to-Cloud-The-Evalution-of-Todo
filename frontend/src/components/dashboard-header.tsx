"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur md:px-8">
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center">
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks, projects..."
                        className="pl-9 bg-muted/50 border-none h-9 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <Button className="hidden sm:flex rounded-full px-4 h-9">Create Task</Button>
            </div>
        </header>
    )
}
