import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, Moon, Sun, Settings, X } from 'lucide-react';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  toggleAdmin: () => void;
}

export default function Header({ toggleTheme, isDark, toggleAdmin }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings] = useState(() => {
    const saved = localStorage.getItem('adminSettings');
    return saved ? JSON.parse(saved) : {
      siteTitle: 'NameCraft',
      logoUrl: '',
      menuItems: []
    };
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteTitle} 
                  className="h-8 w-auto"
                />
              ) : (
                <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  {settings.siteTitle}
                </h1>
              )}
            </Link>
          </div>
          
          <nav className={`${
            isMenuOpen 
              ? 'absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg'
              : 'hidden'
          } lg:flex lg:static lg:border-none lg:shadow-none`}>
            <div className={`${
              isMenuOpen ? 'flex flex-col p-4 space-y-4' : 'hidden'
            } lg:flex lg:flex-row lg:space-x-8 lg:p-0 lg:space-y-0`}>
              {settings.menuItems?.map((item: any) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={toggleAdmin}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Admin Dashboard"
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}