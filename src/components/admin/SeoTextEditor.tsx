import React, { useState, useEffect, useRef } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { SeoText, Category } from '../../types';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
});

export default function SeoTextEditor() {
  const [seoTexts, setSeoTexts] = useState<SeoText[]>(() => {
    const saved = localStorage.getItem('seoTexts');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const addSeoText = () => {
    const newText: SeoText = {
      id: crypto.randomUUID(),
      categoryId: '',
      title: '',
      content: '',
      position: 'before-footer',
    };
    const newTexts = [...seoTexts, newText];
    setSeoTexts(newTexts);
    localStorage.setItem('seoTexts', JSON.stringify(newTexts));
  };

  const updateSeoText = (id: string, updates: Partial<SeoText>) => {
    const newTexts = seoTexts.map((text) =>
      text.id === id ? { ...text, ...updates } : text
    );
    setSeoTexts(newTexts);
    localStorage.setItem('seoTexts', JSON.stringify(newTexts));
  };

  const deleteSeoText = (id: string) => {
    const newTexts = seoTexts.filter((text) => text.id !== id);
    setSeoTexts(newTexts);
    localStorage.setItem('seoTexts', JSON.stringify(newTexts));
  };

  const getAllCategories = (categories: Category[]): Category[] => {
    let allCategories: Category[] = [];
    categories.forEach(category => {
      allCategories.push(category);
      if (category.subcategories.length > 0) {
        allCategories = [...allCategories, ...getAllCategories(category.subcategories)];
      }
    });
    return allCategories;
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  const flatCategories = getAllCategories(categories);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          SEO Text Sections
        </h2>
        <button
          onClick={addSeoText}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add SEO Text
        </button>
      </div>

      <div className="space-y-4">
        {seoTexts.map((text) => (
          <div
            key={text.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={text.title}
                    onChange={(e) => updateSeoText(text.id, { title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={text.categoryId}
                    onChange={(e) => updateSeoText(text.id, { categoryId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="">Homepage (No Category)</option>
                    {flatCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Position
                </label>
                <select
                  value={text.position}
                  onChange={(e) => updateSeoText(text.id, { 
                    position: e.target.value as 'before-footer' | 'after-header' 
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="before-footer">Before Footer</option>
                  <option value="after-header">After Header</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <div className="prose max-w-none">
                  <ReactQuill
                    theme="snow"
                    value={text.content}
                    onChange={(content) => updateSeoText(text.id, { content })}
                    modules={modules}
                    formats={formats}
                    className="bg-white dark:bg-gray-800 [&_.ql-toolbar]:bg-gray-50 dark:[&_.ql-toolbar]:bg-gray-700 [&_.ql-container]:bg-white dark:[&_.ql-container]:bg-gray-800 [&_.ql-editor]:min-h-[200px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => deleteSeoText(text.id)}
                className="p-2 text-red-600 hover:text-red-700"
                title="Delete Text"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => localStorage.setItem('seoTexts', JSON.stringify(seoTexts))}
                className="p-2 text-green-600 hover:text-green-700"
                title="Save Changes"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}