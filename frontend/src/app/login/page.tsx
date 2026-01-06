"use client"

import { Button } from "@/components/ui/Buttons"
import { signIn, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { data: session } = useSession()

  if (session) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn({ email, password })
      if (typeof window !== undefined) window.location.href = "/dashboard"
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-border/40 shadow-2xl backdrop-blur-sm bg-background/80">
        <CardHeader className="space-y-1.5 pb-6">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Log in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2 bg-transparent border-border/60 hover:border-primary/40">
              <Icons.gitHub className="h-4 w-4" />
              <span className="hidden sm:inline">Github</span>
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent border-border/60 hover:border-primary/40">
              <Icons.google className="h-4 w-4" />
              <span className="hidden sm:inline">Google</span>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-border/60 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-border/60 focus-visible:ring-primary/20"
              />
            </div>
            <Button
              className="w-full h-11 text-base font-semibold transition-all hover:-translate-y-px"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-10 flex flex-col items-center gap-3 text-center group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FocusFlow</h1>
            <p className="text-sm text-muted-foreground">Master your productivity</p>
          </div>
        </Link>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-muted-foreground px-6 leading-relaxed">
          By continuing, you agree to FocusFlow&apos;s{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  )
}
