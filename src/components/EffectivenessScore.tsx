import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const EffectivenessScore: React.FC = () => {
  const { effectiveness, feedback, isAnalyzing } = useStore();

  return (
    <div className="relative">
      <motion.div
        className="absolute right-4 top-4 flex items-center gap-2"
        animate={{
          opacity: effectiveness > 0 ? 1 : 0,
          scale: effectiveness > 0 ? 1 : 0.8,
        }}
      >
        <div className="relative group">
          <Sparkles className="w-4 h-4 text-yellow-400 cursor-help" />
          
          <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-black/90 
                        rounded-lg border border-white/10 backdrop-blur-xl
                        invisible group-hover:visible opacity-0 group-hover:opacity-100
                        transition-all duration-200 z-50">
            <h4 className="text-sm font-medium text-white mb-2">Effectiveness Analysis</h4>
            <div className="space-y-1">
              {isAnalyzing ? (
                <p className="text-xs text-white/70">Analyzing prompt...</p>
              ) : feedback.length > 0 ? (
                feedback.map((item, index) => (
                  <p key={index} className="text-xs text-white/70 flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-xs text-white/70">Start typing to see feedback</p>
              )}
            </div>
          </div>
        </div>
        
        <span className="text-sm font-medium text-white/80">
          Effectiveness: {effectiveness}%
        </span>
      </motion.div>
    </div>
  );
};