import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NameGenerator from './components/NameGenerator';
import CategoryGrid from './components/CategoryGrid';
import AdminDashboard from './components/admin/AdminDashboard';
import CategoryPage from './components/CategoryPage';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleAdmin = () => setIsAdmin(!isAdmin);

  if (isAdmin) {
    return (
      <div>
        <button
          onClick={toggleAdmin}
          className="fixed top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 z-50"
        >
          Exit Admin
        </button>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header toggleTheme={toggleTheme} isDark={isDark} toggleAdmin={toggleAdmin} />
      
      <Routes>
        <Route path="/" element={
          <main className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                  NameCraft Generator
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
                  Create unique and memorable names for any purpose
                </p>
              </div>

              <div className="mb-16">
                <NameGenerator />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Categories
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a category to generate specific types of names
                </p>
                <CategoryGrid />
              </div>
            </div>
          </main>
        } />
        <Route path="/category/:id" element={<CategoryPage />} />
      </Routes>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} NameCraft Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}