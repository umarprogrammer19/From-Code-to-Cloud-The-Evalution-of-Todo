"use client"

import { Bell, Search, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Buttons"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push("/")
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/40 bg-background/95 px-4 backdrop-blur md:px-8 shadow-sm">
            <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-muted">
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center">
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks, projects..."
                        className="pl-9 bg-muted/50 border-border/40 h-9 focus-visible:ring-2 focus-visible:ring-ring/50 hover:border-border/60 transition-colors"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <div className="h-8 w-px bg-border/40 hidden sm:block" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Sign out"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
    )
}
