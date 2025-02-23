import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Star, Tag, Trash2, Clock, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';
import type { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const { deletePrompt, copyToEditor, toggleFavorite, favoritePrompts } = useStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: prompt.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFavorite = favoritePrompts.has(prompt.id);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-black/30 rounded-lg p-4 border border-white/10 hover:border-purple-500/30
                 transition-colors cursor-move group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-white/90 flex-1">{prompt.content}</p>
            {prompt.featured && (
              <span className="px-2 py-0.5 bg-yellow-500/20 rounded-full text-xs text-yellow-300">
                Featured
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              {prompt.effectiveness}%
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(prompt.createdAt, { addSuffix: true })}
            </div>

            {prompt.usageCount && (
              <div className="text-xs text-white/40">
                Used {prompt.usageCount} times
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
            {prompt.complexity && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                prompt.complexity === 'beginner' ? 'bg-green-500/20 text-green-300' :
                prompt.complexity === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {prompt.complexity}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleFavorite(prompt.id)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10'
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => copyToEditor(prompt.content)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Copy to editor"
          >
            <Copy className="w-4 h-4 text-white/70" />
          </button>
          
          <button
            onClick={() => deletePrompt(prompt.id)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Delete prompt"
          >
            <Trash2 className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {prompt.examples && prompt.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <details className="text-sm">
            <summary className="text-white/60 cursor-pointer hover:text-white/80">
              View Example
            </summary>
            <p className="mt-2 text-white/80 bg-black/20 p-3 rounded-lg">
              {prompt.examples[0]}
            </p>
          </details>
        </div>
      )}
    </motion.div>
  );
};