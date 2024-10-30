import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import type { NameList } from '../types';

interface NameGeneratorProps {
  categoryId?: string;
}

export default function NameGenerator({ categoryId }: NameGeneratorProps) {
  const [customInput, setCustomInput] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [nameLists, setNameLists] = useState<NameList[]>([]);

  useEffect(() => {
    const savedLists = localStorage.getItem('nameLists');
    if (savedLists) {
      setNameLists(JSON.parse(savedLists));
    }
  }, []);

  const getRelevantLists = () => {
    return nameLists.filter(list => 
      categoryId ? list.categoryId === categoryId : !list.categoryId
    );
  };

  const generateNames = () => {
    const relevantLists = getRelevantLists();
    const allNames: string[] = [];
    
    relevantLists.forEach(list => {
      allNames.push(...list.names);
    });

    if (allNames.length === 0) {
      setGeneratedNames(['No names available in the selected lists']);
      return;
    }

    const newNames: string[] = [];
    for (let i = 0; i < 5; i++) {
      const randomName = allNames[Math.floor(Math.random() * allNames.length)];
      if (customInput) {
        newNames.push(`${customInput}${randomName}`);
      } else {
        newNames.push(randomName);
      }
    }
    
    setGeneratedNames(newNames);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label htmlFor="customName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Custom Prefix (Optional)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="customName"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:text-white"
              placeholder="Enter a prefix..."
            />
          </div>
        </div>

        <button
          onClick={generateNames}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Names
        </button>

        {generatedNames.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Generated Names
            </h3>
            <ul className="space-y-2">
              {generatedNames.map((name, index) => (
                <li
                  key={index}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}