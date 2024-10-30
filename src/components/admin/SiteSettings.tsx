import React, { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import type { AdminSettings } from '../../types';

interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('adminSettings');
    return saved ? JSON.parse(saved) : {
      siteTitle: 'NameCraft Generator',
      logoUrl: '',
      menuItems: [],
      homeSeoTitle: 'NameCraft - Generate Unique Names',
      homeSeoDescription: 'Generate unique and creative names for any purpose',
      homeSeoKeywords: 'name generator, username generator, character names',
      categories: [],
      nameGenerationRules: {
        minLength: 3,
        maxLength: 20,
        customPrefixes: [],
        customSuffixes: [],
      },
    };
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSettings = (updates: Partial<AdminSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
  };

  const handleLogoUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSettings({ logoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addMenuItem = () => {
    const newMenuItem: MenuItem = {
      id: crypto.randomUUID(),
      label: '',
      url: '',
    };
    updateSettings({
      menuItems: [...(settings.menuItems || []), newMenuItem],
    });
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const newMenuItems = settings.menuItems?.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ) || [];
    updateSettings({ menuItems: newMenuItems });
  };

  const removeMenuItem = (id: string) => {
    const newMenuItems = settings.menuItems?.filter(item => item.id !== id) || [];
    updateSettings({ menuItems: newMenuItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Site Settings
        </h2>
        <button 
          onClick={() => localStorage.setItem('adminSettings', JSON.stringify(settings))}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Site Title
            </label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => updateSettings({ siteTitle: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Logo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Logo</span>
              </button>
              {settings.logoUrl && (
                <div className="relative">
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteTitle}
                    className="h-10 w-auto"
                  />
                  <button
                    onClick={() => updateSettings({ logoUrl: '' })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              If no logo is uploaded, the site title will be displayed as text.
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Menu Items
              </h3>
              <button
                onClick={addMenuItem}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Menu Item
              </button>
            </div>
            <div className="space-y-4">
              {settings.menuItems?.map((item: MenuItem) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                    placeholder="Menu Label"
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateMenuItem(item.id, { url: e.target.value })}
                    placeholder="URL or Path"
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Homepage SEO
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={settings.homeSeoTitle}
                  onChange={(e) => updateSettings({ homeSeoTitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SEO Description
                </label>
                <textarea
                  value={settings.homeSeoDescription}
                  onChange={(e) => updateSettings({ homeSeoDescription: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={settings.homeSeoKeywords}
                  onChange={(e) => updateSettings({ homeSeoKeywords: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Comma-separated keywords"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}