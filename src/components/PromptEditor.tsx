import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Wand2, Copy, Save, Sparkles } from 'lucide-react';
import { useDebounce } from 'react-use';
import { useStore } from '../store/useStore';
import { Suggestions } from './Suggestions';
import { EffectivenessScore } from './EffectivenessScore';

export const PromptEditor: React.FC = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    analyzePrompt,
    generateSuggestions,
    generateVariations,
    variations,
    savePrompt,
  } = useStore();
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentPrompt(e.target.value);
  }, [setCurrentPrompt]);

  const handleGenerateVariations = useCallback(async () => {
    if (currentPrompt.trim()) {
      await generateVariations(currentPrompt);
    }
  }, [currentPrompt, generateVariations]);

  const handleCopyPrompt = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleSavePrompt = useCallback(() => {
    if (currentPrompt.trim()) {
      savePrompt(currentPrompt);
    }
  }, [currentPrompt, savePrompt]);

  useDebounce(
    () => {
      if (currentPrompt.length > 0) {
        analyzePrompt(currentPrompt);
        generateSuggestions(currentPrompt);
      }
    },
    500,
    [currentPrompt]
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="absolute -top-3 -left-3 bg-indigo-500/20 w-full h-full rounded-2xl -z-10" />
        
        <div className="flex items-center gap-4 mb-6">
          <Brain className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            Nebula Prompt Engineer
          </h2>
        </div>

        <div className="relative mb-8">
          <textarea
            ref={editorRef}
            value={currentPrompt}
            onChange={handlePromptChange}
            className="w-full h-40 bg-black/40 rounded-xl p-4 text-white placeholder-white/50 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none
                     backdrop-blur-sm font-medium"
            placeholder="Enter your prompt here..."
          />
          
          <EffectivenessScore />
        </div>

        <Suggestions />

        {variations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Generated Variations
            </h3>
            <div className="space-y-4">
              {variations.map((variation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/30 rounded-lg p-4 border border-white/5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-white/90 flex-1">{variation}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyPrompt(variation)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-white/70" />
                      </button>
                      <button
                        onClick={() => setCurrentPrompt(variation)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Use this variation"
                      >
                        <Wand2 className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <motion.button
            onClick={handleGenerateVariations}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg 
                     flex items-center gap-2 text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Wand2 className="w-4 h-4" />
            Generate Variations
          </motion.button>
          
          <motion.button
            onClick={handleSavePrompt}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg 
                     flex items-center gap-2 text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            Save to Library
          </motion.button>
        </div>
      </div>
    </div>
  );
};