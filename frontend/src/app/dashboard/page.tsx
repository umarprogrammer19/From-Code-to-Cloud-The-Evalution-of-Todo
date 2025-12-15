'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/components/ui/Layout';
import TodoStats from '@/components/todos/TodoStats';
import AddTodoForm from '@/components/todos/AddTodoForm';
import TodoList from '@/components/todos/TodoList';

const DashboardPage = () => {
  const { data: session, isPending } = useSession();

  // If still loading the session, show nothing or a loading state
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If no session, redirect to login
  if (!session) {
    redirect('/login');
    return null;
  }

  return (
    <Layout title="Todo Dashboard">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Todo List</h2>

        <TodoStats />

        <AddTodoForm />

        <TodoList />
      </div>
    </Layout>
  );
};

export default DashboardPage;