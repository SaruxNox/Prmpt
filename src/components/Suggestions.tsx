import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Suggestions: React.FC = () => {
  const { suggestions, currentPrompt, setCurrentPrompt } = useStore();

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentPrompt(currentPrompt + ' ' + suggestion);
  };

  return suggestions.length > 0 ? (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-medium text-white/80">Suggested Keywords</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion.text)}
            className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-full 
                     text-sm text-white/90 border border-indigo-500/30 transition-colors
                     hover:border-indigo-500/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {suggestion.text}
          </motion.button>
        ))}
      </div>
    </div>
  ) : null;
};