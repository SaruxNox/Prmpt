import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PromptGenerationAssistant: React.FC = () => {
  const { currentPrompt, suggestions, generateSuggestions } = useStore();

  const getContextualSuggestions = () => {
    // Implementation for contextual suggestions
    return [
      {
        type: 'structure',
        text: 'Add more specific details',
        example: 'Consider including numerical values or specific examples',
      },
      {
        type: 'enhancement',
        text: 'Use action verbs',
        example: 'Start sentences with strong action words',
      },
      {
        type: 'clarity',
        text: 'Break into steps',
        example: 'Divide complex instructions into numbered steps',
      },
    ];
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Generation Assistant</h3>
      </div>

      <div className="space-y-4">
        {getContextualSuggestions().map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/20 rounded-lg p-3 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90">{suggestion.text}</span>
            </div>
            <p className="text-sm text-white/60 pl-6">{suggestion.example}</p>
          </motion.div>
        ))}

        <div className="mt-6">
          <button
            onClick={() => generateSuggestions(currentPrompt)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 
                     bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
          >
            <Zap className="w-4 h-4" />
            Generate More Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};