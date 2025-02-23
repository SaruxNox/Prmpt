import React from 'react';
import { motion } from 'framer-motion';
import { History, GitBranch, GitMerge, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { diff as diffLib } from 'diff';

export const PromptVersionControl: React.FC = () => {
  const { promptHistory, currentPrompt, setCurrentPrompt } = useStore();

  const calculateDiff = (oldVersion: string, newVersion: string) => {
    const diff = diffLib.diffWords(oldVersion, newVersion);
    return diff.map((part, index) => (
      <span
        key={index}
        className={`${
          part.added ? 'text-green-400' :
          part.removed ? 'text-red-400 line-through' :
          'text-white/80'
        }`}
      >
        {part.value}
      </span>
    ));
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <History className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Version History</h3>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {promptHistory.map((version, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/20 rounded-lg p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/60">
                  Version {promptHistory.length - index}
                </span>
              </div>
              <span className="text-xs text-white/40">
                {formatDistanceToNow(new Date(), { addSuffix: true })}
              </span>
            </div>

            <div className="mb-3 text-sm">
              {calculateDiff(version, currentPrompt)}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCurrentPrompt(version)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 
                         hover:bg-purple-500/30 rounded-md transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Restore
              </button>
              <button
                onClick={() => {
                  const merged = `${currentPrompt} ${version}`;
                  setCurrentPrompt(merged);
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/20 
                         hover:bg-blue-500/30 rounded-md transition-colors"
              >
                <GitMerge className="w-3 h-3" />
                Merge
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};