"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Layout, Clock, Search, Smartphone } from "lucide-react"

const features = [
    {
        title: "Lightning Fast",
        description: "Built for speed. Capture tasks as fast as you think them with our optimized interface.",
        icon: Zap,
    },
    {
        title: "Smart Organization",
        description: "Automatically categorize and prioritize tasks using our intelligent sorting system.",
        icon: Layout,
    },
    {
        title: "Time Tracking",
        description: "Keep track of how much time you spend on each task to improve your workflow.",
        icon: Clock,
    },
    {
        title: "Global Search",
        description: "Find anything instantly with our powerful, lightning-fast global search.",
        icon: Search,
    },
    {
        title: "Secure by Design",
        description: "Your data is encrypted and protected with industry-standard security protocols.",
        icon: Shield,
    },
    {
        title: "Mobile First",
        description: "Manage your tasks on the go with our fully responsive mobile experience.",
        icon: Smartphone,
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to stay focused</h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Powerful features designed to help you organize your work and life without the complexity.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group rounded-2xl border bg-background p-8 transition-shadow hover:shadow-lg"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
