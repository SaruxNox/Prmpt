import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PromptOptimizationAssistant: React.FC = () => {
  const { currentPrompt, effectiveness, feedback } = useStore();

  const getOptimizationTips = () => {
    const tips = [
      {
        type: 'success',
        icon: <CheckCircle className="w-4 h-4 text-green-400" />,
        message: 'Clear and specific instructions',
      },
      {
        type: 'warning',
        icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
        message: 'Consider adding more context',
      },
      {
        type: 'tip',
        icon: <Zap className="w-4 h-4 text-blue-400" />,
        message: 'Use descriptive language',
      },
    ];

    return tips;
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Optimization Assistant</h3>
      </div>

      <div className="space-y-4">
        {getOptimizationTips().map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 bg-black/20 rounded-lg p-3 border border-white/5"
          >
            {tip.icon}
            <p className="text-sm text-white/80">{tip.message}</p>
          </motion.div>
        ))}

        {feedback.map((item, index) => (
          <motion.div
            key={`feedback-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 3) * 0.1 }}
            className="flex items-start gap-3 bg-black/20 rounded-lg p-3 border border-white/5"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <p className="text-sm text-white/80">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};