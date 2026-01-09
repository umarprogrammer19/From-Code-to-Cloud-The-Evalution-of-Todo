import { Landing } from "@/components/landing"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "FocusFlow - Master Your Productivity",
  description:
    "The ultimate task management app for professionals. Organize, prioritize, and accomplish your goals with ease.",
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Landing />
      <Footer />
    </>
  )
}
