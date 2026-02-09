'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getJwtFromHash, storeJwt } from '@/services/authService';
import Link from 'next/link';
import LoginForm from '@/app/components/LoginForm';
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getJwtFromHash();
    if (token) {
      storeJwt(token);
      router.push('/dashboard'); // Redirect to dashboard instead of tasks
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900/20 to-black flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 font-medium"
          >
            Home
          </motion.button>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            TaskMastery
          </h1>
          <p className="text-gray-400">Professional task management platform</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            © 2025 TaskMastery. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
