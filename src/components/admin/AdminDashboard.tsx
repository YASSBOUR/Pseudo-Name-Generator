import React, { useState } from 'react';
import { Settings, List, FileText, Users, Type } from 'lucide-react';
import CategoryEditor from './CategoryEditor';
import NameListEditor from './NameListEditor';
import SiteSettings from './SiteSettings';
import ContentEditor from './ContentEditor';
import SeoTextEditor from './SeoTextEditor';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', label: 'Categories', icon: List },
    { id: 'namelists', label: 'Name Lists', icon: FileText },
    { id: 'seotexts', label: 'SEO Texts', icon: Type },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'content', label: 'Content Pages', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
          </div>
          <nav className="mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'categories' && <CategoryEditor />}
          {activeTab === 'namelists' && <NameListEditor />}
          {activeTab === 'seotexts' && <SeoTextEditor />}
          {activeTab === 'settings' && <SiteSettings />}
          {activeTab === 'content' && <ContentEditor />}
        </div>
      </div>
    </div>
  );
}