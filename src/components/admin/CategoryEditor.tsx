import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, ChevronDown, ChevronRight, Upload, X } from 'lucide-react';
import type { Category } from '../../types';

export default function CategoryEditor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('categories', JSON.stringify(newCategories));
  };

  const addCategory = (parentId?: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      imageUrl: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      subcategories: [],
      isSubcategory: !!parentId,
    };

    if (parentId) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === parentId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, newCategory]
          };
        }
        return cat;
      });
      saveCategories(updatedCategories);
    } else {
      saveCategories([...categories, newCategory]);
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updateCategoryInList = (list: Category[]): Category[] => {
      return list.map(cat => {
        if (cat.id === id) {
          return { ...cat, ...updates };
        }
        if (cat.subcategories.length > 0) {
          return {
            ...cat,
            subcategories: updateCategoryInList(cat.subcategories)
          };
        }
        return cat;
      });
    };

    const updatedCategories = updateCategoryInList(categories);
    saveCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const deleteCategoryFromList = (list: Category[]): Category[] => {
      return list.filter(cat => {
        if (cat.id === id) return false;
        if (cat.subcategories.length > 0) {
          cat.subcategories = deleteCategoryFromList(cat.subcategories);
        }
        return true;
      });
    };

    const updatedCategories = deleteCategoryFromList(categories);
    saveCategories(updatedCategories);
  };

  const handleImageUpload = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateCategory(id, { imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (category: Category, level = 0) => {
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="space-y-2" style={{ marginLeft: `${level * 1.5}rem` }}>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    value={category.description}
                    onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(category.id, file);
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                  {category.imageUrl && (
                    <div className="relative">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <button
                        onClick={() => updateCategory(category.id, { imageUrl: '' })}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Settings</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={category.seoTitle}
                    onChange={(e) => updateCategory(category.id, { seoTitle: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SEO Description
                  </label>
                  <textarea
                    value={category.seoDescription}
                    onChange={(e) => updateCategory(category.id, { seoDescription: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    SEO Keywords
                  </label>
                  <input
                    type="text"
                    value={category.seoKeywords}
                    onChange={(e) => updateCategory(category.id, { seoKeywords: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="Comma-separated keywords"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => addCategory(category.id)}
                className="p-2 text-purple-600 hover:text-purple-700"
                title="Add Subcategory"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="p-2 text-red-600 hover:text-red-700"
                title="Delete Category"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => saveCategories(categories)}
                className="p-2 text-green-600 hover:text-green-700"
                title="Save Changes"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {isExpanded && category.subcategories.length > 0 && (
          <div className="space-y-2">
            {category.subcategories.map(subcat => renderCategory(subcat, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Categories
        </h2>
        <button
          onClick={() => addCategory()}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map(category => renderCategory(category))}
      </div>
    </div>
  );
}