import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PromptQualityScore: React.FC = () => {
  const { effectiveness, feedback } = useStore();

  const getQualityMetrics = () => {
    return [
      {
        name: 'Clarity',
        score: Math.min(100, effectiveness + Math.random() * 20),
        color: 'text-blue-400',
      },
      {
        name: 'Specificity',
        score: Math.min(100, effectiveness + Math.random() * 15),
        color: 'text-purple-400',
      },
      {
        name: 'Structure',
        score: Math.min(100, effectiveness + Math.random() * 10),
        color: 'text-green-400',
      },
    ];
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Quality Score</h3>
      </div>

      <div className="space-y-4">
        {getQualityMetrics().map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/80">{metric.name}</span>
              <span className={`text-sm font-medium ${metric.color}`}>
                {metric.score.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.score}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full ${metric.color.replace('text', 'bg')}/50`}
              />
            </div>
          </motion.div>
        ))}

        <div className="mt-6 space-y-2">
          {feedback.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};