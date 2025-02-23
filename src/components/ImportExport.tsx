import React from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, FileJson, Copy } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ImportExport: React.FC = () => {
  const { savedPrompts, promptHistory, settings } = useStore();

  const exportData = () => {
    const data = {
      prompts: savedPrompts,
      history: promptHistory,
      settings,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nebula-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Implementation for importing data
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <FileJson className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Import/Export</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportData}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 
                   hover:bg-purple-500/30 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </motion.button>

        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 
                   hover:bg-blue-500/30 rounded-lg transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </motion.label>
      </div>
    </div>
  );
};