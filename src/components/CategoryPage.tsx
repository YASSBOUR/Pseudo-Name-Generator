import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Category, SeoText } from '../types';
import NameGenerator from './NameGenerator';

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [seoTexts, setSeoTexts] = useState<SeoText[]>([]);

  useEffect(() => {
    const loadCategory = () => {
      const savedCategories = localStorage.getItem('categories');
      const savedSeoTexts = localStorage.getItem('seoTexts');
      
      if (savedCategories) {
        const categories: Category[] = JSON.parse(savedCategories);
        const findCategory = (cats: Category[]): Category | null => {
          for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.subcategories.length > 0) {
              const found = findCategory(cat.subcategories);
              if (found) return found;
            }
          }
          return null;
        };
        const found = findCategory(categories);
        setCategory(found);

        if (found) {
          document.title = found.seoTitle || found.name;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', found.seoDescription);
          }
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) {
            metaKeywords.setAttribute('content', found.seoKeywords);
          }
        }
      }

      if (savedSeoTexts) {
        const texts: SeoText[] = JSON.parse(savedSeoTexts);
        setSeoTexts(texts.filter(text => text.categoryId === id));
      }
    };

    loadCategory();
  }, [id]);

  if (!category) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 dark:text-gray-400">Category not found</p>
        </div>
      </div>
    );
  }

  const renderSeoText = (position: 'before-footer' | 'after-header') => {
    const text = seoTexts.find(t => t.position === position);
    if (!text) return null;

    return (
      <div className="prose dark:prose-invert max-w-none">
        <h2>{text.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: text.content }} />
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {category.imageUrl && (
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">
                {category.name}
              </h1>
              <p className="mt-2 text-gray-400">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {renderSeoText('after-header')}

        {category.isSubcategory ? (
          <div className="mb-12">
            <NameGenerator categoryId={category.id} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/category/${subcategory.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-700 hover:border-orange-500 transition-colors"
              >
                <div className="absolute inset-0">
                  {subcategory.imageUrl ? (
                    <img 
                      src={subcategory.imageUrl} 
                      alt={subcategory.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-800" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">
                      {subcategory.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                      {subcategory.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {renderSeoText('before-footer')}
      </div>
    </div>
  );
}