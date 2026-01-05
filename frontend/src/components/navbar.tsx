"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">FocusFlow</span>
                </Link>
                <nav className="hidden md:flex md:items-center md:gap-6">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Features
                    </Link>
                    <Link
                        href="#solutions"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Solutions
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Pricing
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button size="sm" asChild className="rounded-full px-6">
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>
            </div>
        </motion.header>
    )
}
