import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Star, Tag, Clock, Filter, SortAsc, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PromptCard } from './PromptCard';
import { CategoryFilter } from './CategoryFilter';

export const Library: React.FC = () => {
  const { savedPrompts, categories, searchPrompts, filterPrompts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'effectiveness' | 'name'>('date');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searchPrompts(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterPrompts(category);
  };

  const sortedPrompts = [...savedPrompts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'effectiveness':
        return b.effectiveness - a.effectiveness;
      case 'name':
        return a.content.localeCompare(b.content);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Book className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Prompt Library</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setSortBy('date')}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === 'date' ? 'bg-purple-500/20' : 'hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => setSortBy('effectiveness')}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === 'effectiveness' ? 'bg-purple-500/20' : 'hover:bg-white/5'
              }`}
            >
              <Star className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === 'name' ? 'bg-purple-500/20' : 'hover:bg-white/5'
              }`}
            >
              <SortAsc className="w-4 h-4 text-white/70" />
            </button>
          </div>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title={isMinimized ? "Expand library" : "Minimize library"}
          >
            {isMinimized ? (
              <ChevronDown className="w-4 h-4 text-white/70" />
            ) : (
              <ChevronUp className="w-4 h-4 text-white/70" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search prompts..."
                  className="w-full bg-black/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40
                          border border-white/10 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>

            <DndContext collisionDetection={closestCenter}>
              <SortableContext items={sortedPrompts} strategy={verticalListSortingStrategy}>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {sortedPrompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};