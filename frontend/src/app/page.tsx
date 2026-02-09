"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "@/app/components/DarkModeToggle";
import MenuIcon from "@/app/components/icons/MenuIcon";
import CloseIcon from "@/app/components/icons/CloseIcon";
import FloatingChatWidget from "@/app/components/FloatingChatWidget";

export default function HomePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900/20 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent"
          >
            TaskMastery
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/chat")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/25"
            >
              AI Chat
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoginClick}
              className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 font-medium"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignupClick}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/25"
            >
              Sign Up
            </motion.button>
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="z-50 text-white"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-0 left-0 w-full h-screen bg-gray-900/90 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              router.push("/chat");
              setIsMenuOpen(false);
            }}
            className="text-2xl px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/25"
          >
            AI Chat
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              router.push("/dashboard");
              setIsMenuOpen(false);
            }}
            className="text-2xl text-gray-300 hover:text-white transition-colors font-medium"
          >
            Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              handleLoginClick();
              setIsMenuOpen(false);
            }}
            className="text-2xl px-6 py-3 rounded-lg bg-gray-800/50 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 font-medium"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              handleSignupClick();
              setIsMenuOpen(false);
            }}
            className="text-2xl px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/25"
          >
            Sign Up
          </motion.button>
          <div className="mt-4">
            <DarkModeToggle />
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 pt-10 pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/30 text-sm font-medium">
                🚀 The Future of Productivity
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                Transform Your Tasks
              </span>
              <br />
              <span className="text-white">Into Accomplishments</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mb-10"
            >
              Harness the power of AI to organize, prioritize, and execute your tasks with precision.
              Join thousands of professionals who have revolutionized their workflow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignupClick}
                className="btn btn-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 min-w-[200px]"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/chat")}
                className="btn btn-outline px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 min-w-[200px]"
              >
                Try AI Chat
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-5xl mx-auto"
            >
              <div className="relative rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-2">95%</div>
                    <div className="text-gray-400">Task Completion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-2">4.8/5</div>
                    <div className="text-gray-400">User Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-2">10K+</div>
                    <div className="text-gray-400">Active Users</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features designed to maximize your productivity and efficiency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "AI-Powered Insights",
                desc: "Get intelligent suggestions on task prioritization and time management based on your habits",
                icon: "🤖"
              },
              {
                title: "Smart Organization",
                desc: "Automatically categorize and prioritize tasks with our advanced AI algorithms",
                icon: "🧠"
              },
              {
                title: "Focus Mode",
                desc: "Minimize distractions with our dedicated focus mode that blocks interruptions",
                icon: "🎯"
              },
              {
                title: "Real-time Sync",
                desc: "Instant updates across all your devices with seamless synchronization",
                icon: "🔄"
              },
              {
                title: "Advanced Analytics",
                desc: "Detailed insights into your productivity patterns and task completion rates",
                icon: "📊"
              },
              {
                title: "Team Collaboration",
                desc: "Seamlessly collaborate with your team on shared projects and tasks",
                icon: "👥"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="p-8 card hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-emerald-400 mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                How TaskMastery Works
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Our AI-powered platform simplifies your workflow with three easy steps
              </p>

              <div className="space-y-8">
                {[
                  { step: "01", title: "Add Your Tasks", desc: "Simply add tasks through our intuitive interface or AI assistant" },
                  { step: "02", title: "AI Organizes", desc: "Our AI categorizes and prioritizes tasks based on your goals" },
                  { step: "03", title: "Execute & Track", desc: "Complete tasks and track your productivity with detailed analytics" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-yellow-500 bg-clip-text text-transparent mr-4 min-w-[40px]">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                        <span className="text-emerald-400 text-sm">✓</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Complete project proposal</div>
                        <div className="text-sm text-gray-400">Due: Today, 5:00 PM</div>
                      </div>
                      <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">High Priority</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <span className="text-yellow-400 text-sm">!</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Team meeting preparation</div>
                        <div className="text-sm text-gray-400">Due: Tomorrow, 10:00 AM</div>
                      </div>
                      <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Medium Priority</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700/30 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <span className="text-purple-400 text-sm">📅</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Quarterly review</div>
                        <div className="text-sm text-gray-400">Due: Jan 15, 2025</div>
                      </div>
                      <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">Low Priority</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-yellow-500/10 rounded-xl border border-emerald-500/30">
                  <div className="text-emerald-400 font-medium mb-1">AI Suggestion</div>
                  <div className="text-gray-300 text-sm">Focus on the project proposal first as it's the highest priority and due today.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Trusted by Professionals
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of users who have transformed their productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "TaskMastery has completely transformed how I manage my projects. The AI features are incredible!",
                author: "Sarah Johnson",
                role: "Product Manager"
              },
              {
                quote: "I've tried many task management tools, but this is by far the most intuitive and powerful.",
                author: "Michael Chen",
                role: "Software Engineer"
              },
              {
                quote: "The analytics helped me identify my most productive hours and optimize my workflow.",
                author: "Elena Rodriguez",
                role: "Marketing Director"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="p-8 card"
              >
                <div className="text-yellow-400 text-4xl mb-4">“</div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="text-emerald-400 font-bold">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-4xl mx-auto p-12 card text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of professionals who have revolutionized their task management workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignupClick}
                className="btn btn-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="btn btn-outline px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 TaskMastery. Precision tools for productive minds.</p>
      </footer>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
}