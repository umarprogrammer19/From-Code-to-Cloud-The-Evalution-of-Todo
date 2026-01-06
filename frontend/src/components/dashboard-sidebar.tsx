"use client"

import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { CheckCircle2, LayoutDashboard, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    // { name: "My Tasks", href: "/dashboard/tasks", icon: CheckCircle2 },
    // { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    // { name: "Team", href: "/dashboard/team", icon: Users },
]

// const projects = [
//     { name: "Work", color: "text-blue-500" },
//     { name: "Personal", color: "text-green-500" },
//     { name: "Urgent", color: "text-red-500" },
// ]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { data: session, isPending } = useSession()

    if (isPending) {
        return (
            <div className="hidden w-64 border-r border-border/40 bg-background md:flex md:flex-col">
                <div className="flex h-16 items-center border-b border-border/40 px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-linear-to-br from-primary to-secondary">
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">FocusFlow</span>
                    </Link>
                </div>
                <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-6">
                    <div className="px-3">
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <span
                                        className={cn(
                                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground",
                                            pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                        )}
                                    >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="hidden w-64 border-r border-border/40 bg-background md:flex md:flex-col">
            <div className="flex h-16 items-center border-b border-border/40 px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-linear-to-br from-primary to-secondary">
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">FocusFlow</span>
                </Link>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-6">
                <div className="px-3">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <span
                                    className={cn(
                                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-accent-foreground",
                                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                    )}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* <div className="px-6">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Projects</h3>
                    <div className="space-y-1">
                        {projects.map((project) => (
                            <button
                                key={project.name}
                                className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/50 hover:text-accent-foreground"
                            >
                                <Hash className={cn("mr-3 h-4 w-4", project.color)} />
                                {project.name}
                            </button>
                        ))}
                        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all">
                            <PlusCircle className="mr-3 h-4 w-4" />
                            New Project
                        </button>
                    </div>
                </div> */}
            </div>

            <div className="border-t border-border/40 p-4">
                <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                        <span className="text-xs font-semibold">{session?.user?.name || "User"}</span>
                        <span className="text-[10px] text-muted-foreground">Pro Plan</span>
                    </div>
                    <Link href="/dashboard/settings">
                        <Settings className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
