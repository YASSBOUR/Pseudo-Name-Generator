import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ContentPage {
  id: string;
  title: string;
  content: string;
  slug: string;
}

export default function ContentEditor() {
  const [pages, setPages] = useState<ContentPage[]>([]);

  const addPage = () => {
    const newPage: ContentPage = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      slug: '',
    };
    setPages([...pages, newPage]);
  };

  const updatePage = (id: string, updates: Partial<ContentPage>) => {
    setPages(
      pages.map((page) =>
        page.id === id ? { ...page, ...updates } : page
      )
    );
  };

  const deletePage = (id: string) => {
    setPages(pages.filter((page) => page.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Content Pages
        </h2>
        <button
          onClick={addPage}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </button>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page Title
                </label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) =>
                    updatePage(page.id, { title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) =>
                    updatePage(page.id, { slug: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                value={page.content}
                onChange={(e) =>
                  updatePage(page.id, { content: e.target.value })
                }
                className="mt-1 block w-full h-32 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => deletePage(page.id)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-green-600 hover:text-green-700">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}