import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { NameList, Category } from '../../types';

export default function NameListEditor() {
  const [nameLists, setNameLists] = useState<NameList[]>(() => {
    const saved = localStorage.getItem('nameLists');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const addNameList = () => {
    const newNameList: NameList = {
      id: crypto.randomUUID(),
      categoryId: '',
      name: '',
      names: [],
    };
    const newLists = [...nameLists, newNameList];
    setNameLists(newLists);
    localStorage.setItem('nameLists', JSON.stringify(newLists));
  };

  const updateNameList = (id: string, updates: Partial<NameList>) => {
    const newLists = nameLists.map((list) =>
      list.id === id ? { ...list, ...updates } : list
    );
    setNameLists(newLists);
    localStorage.setItem('nameLists', JSON.stringify(newLists));
  };

  const deleteNameList = (id: string) => {
    const newLists = nameLists.filter((list) => list.id !== id);
    setNameLists(newLists);
    localStorage.setItem('nameLists', JSON.stringify(newLists));
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

  const flatCategories = getAllCategories(categories);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Name Lists
        </h2>
        <button
          onClick={addNameList}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Name List
        </button>
      </div>

      <div className="space-y-4">
        {nameLists.map((list) => (
          <div
            key={list.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={list.name}
                    onChange={(e) => updateNameList(list.id, { name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="Enter list name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={list.categoryId}
                    onChange={(e) => updateNameList(list.id, { categoryId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <option value="">General (No Category)</option>
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
                  Names (One per line)
                </label>
                <textarea
                  value={list.names.join('\n')}
                  onChange={(e) => updateNameList(list.id, { names: e.target.value.split('\n').filter(n => n.trim()) })}
                  className="mt-1 block w-full h-32 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  placeholder="Enter names (one per line)"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => deleteNameList(list.id)}
                className="p-2 text-red-600 hover:text-red-700"
                title="Delete List"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => localStorage.setItem('nameLists', JSON.stringify(nameLists))}
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