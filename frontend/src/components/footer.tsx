import Link from "next/link"
import { CheckCircle2, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-12 py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-full lg:col-span-2">
                        <Link href="/" className="mb-6 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">FocusFlow</span>
                        </Link>
                        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
                            The professional task management platform designed for modern teams and high-performers.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Privacy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary">
                                    Status
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} FocusFlow Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
