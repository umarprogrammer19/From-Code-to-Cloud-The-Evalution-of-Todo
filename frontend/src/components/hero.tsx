"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="container relative z-10 mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-6 flex max-w-fit items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium"
                >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>The future of task management is here</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto mb-6 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
                >
                    Focus on what <span className="text-primary">matters</span>, leave the rest to us.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
                >
                    FocusFlow helps you organize your life, hit your deadlines, and reach your goals with a beautiful, intuitive
                    interface designed for peak productivity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Button
                        size="lg"
                        asChild
                        className="h-12 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/20"
                    >
                        <Link href="/dashboard">
                            Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base font-semibold bg-transparent">
                        Watch Demo
                    </Button>
                </motion.div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-125 w-200 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] bg-linear-to-tr from-primary to-blue-400" />
        </section>
    )
}
