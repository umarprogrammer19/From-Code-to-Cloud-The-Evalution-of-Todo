"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Zap, BarChart3, Shield, ArrowRight, Users, Sparkles } from "lucide-react"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export function Landing() {
    return (
        <main className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20" />
                    <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-20" />
                </div>

                <motion.div
                    className="max-w-4xl mx-auto text-center space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Introducing FocusFlow</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                        Master Your{" "}
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Productivity
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                        Stay organized, focused, and productive with FocusFlow. The all-in-one task management solution designed for
                        modern professionals.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="gap-2 rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-lg hover:shadow-primary/35"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent">
                                Sign In
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="pt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold border-2 border-background"
                                >
                                    {i}
                                </div>
                            ))}
                        </div>
                        <span>Join 10,000+ productive professionals</span>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center space-y-4 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to stay organized and productive
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                icon: CheckCircle2,
                                title: "Smart Task Management",
                                description: "Create, organize, and track tasks with priority levels and due dates.",
                            },
                            {
                                icon: BarChart3,
                                title: "Productivity Analytics",
                                description: "Track your productivity with detailed stats and insights.",
                            },
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "Built for speed. Get things done faster with our optimized interface.",
                            },
                            {
                                icon: Shield,
                                title: "Secure & Private",
                                description: "Enterprise-grade security to keep your tasks and data safe.",
                            },
                            {
                                icon: Users,
                                title: "Team Collaboration",
                                description: "Share tasks, assign work, and collaborate with your team.",
                            },
                            {
                                icon: Sparkles,
                                title: "Dark Mode",
                                description: "Beautiful dark theme for comfortable viewing anytime.",
                            },
                        ].map((feature, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <Card className="h-full hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            <feature.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="relative rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/10 p-12 text-center space-y-8 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your Productivity?</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Start managing your tasks more effectively today. No credit card required.
                            </p>
                        </div>

                        <Link href="/signup">
                            <Button size="lg" className="rounded-full px-8 gap-2">
                                Get Started Now
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
