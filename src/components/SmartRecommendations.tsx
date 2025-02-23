import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Clock, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SmartRecommendations: React.FC = () => {
  const { currentPrompt, savedPrompts } = useStore();

  const getRecommendations = () => {
    return [
      {
        type: 'similar',
        icon: <Star className="w-4 h-4 text-yellow-400" />,
        title: 'Similar Prompts',
        items: savedPrompts.slice(0, 3).map(p => ({
          id: p.id,
          content: p.content,
          score: p.effectiveness,
        })),
      },
      {
        type: 'trending',
        icon: <TrendingUp className="w-4 h-4 text-green-400" />,
        title: 'Trending Patterns',
        items: [
          { id: '1', content: 'Use specific examples', score: 95 },
          { id: '2', content: 'Include numerical values', score: 92 },
          { id: '3', content: 'Add context details', score: 88 },
        ],
      },
      {
        type: 'recent',
        icon: <Clock className="w-4 h-4 text-blue-400" />,
        title: 'Recent Success',
        items: savedPrompts
          .filter(p => p.effectiveness > 90)
          .slice(0, 3)
          .map(p => ({
            id: p.id,
            content: p.content,
            score: p.effectiveness,
          })),
      },
    ];
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Smart Recommendations</h3>
      </div>

      <div className="space-y-6">
        {getRecommendations().map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h4 className="text-sm font-medium text-white/80">{section.title}</h4>
            </div>

            <div className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 3 + itemIndex) * 0.1 }}
                  className="bg-black/20 rounded-lg p-3 border border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/90 line-clamp-2">{item.content}</p>
                    <span className="text-xs font-medium px-2 py-1 bg-purple-500/20 rounded-full">
                      {item.score}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};