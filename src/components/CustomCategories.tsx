import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tags, Plus, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

export const CustomCategories: React.FC = () => {
  const { categories, setSettings } = useStore();
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const addCategory = () => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: 'New Category',
      color: '#6366f1',
      description: '',
    };
    setCustomCategories([...customCategories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== id));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCustomCategories(customCategories.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Tags className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Custom Categories</h3>
        </div>
        
        <button
          onClick={addCategory}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 
                   hover:bg-purple-500/30 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {customCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 rounded-lg p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              {isEditing === category.id ? (
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                  className="bg-transparent border-none text-white focus:outline-none"
                  onBlur={() => setIsEditing(null)}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-white/90">{category.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(category.id)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-white/70" />
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <input
              type="text"
              value={category.description}
              onChange={(e) => updateCategory(category.id, { description: e.target.value })}
              className="w-full bg-black/20 rounded-md px-3 py-2 text-sm text-white/90 
                       border border-white/10 focus:outline-none focus:border-purple-500/50"
              placeholder="Category description"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};