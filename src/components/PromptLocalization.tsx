import React from 'react';
import { motion } from 'framer-motion';
import { Globe, HandPlatter as Translate, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export const PromptLocalization: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentPrompt, setCurrentPrompt } = useStore();
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  const translatePrompt = async (targetLang: string) => {
    try {
      // Implementation for translation
      setSelectedLanguage(targetLang);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Localization</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => translatePrompt(lang.code)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg 
                     transition-colors ${
                       selectedLanguage === lang.code
                         ? 'bg-purple-500/30 border-purple-500/50'
                         : 'bg-black/20 border-white/10'
                     } border`}
          >
            <span className="text-sm text-white/90">{lang.name}</span>
            {selectedLanguage === lang.code && (
              <Check className="w-4 h-4 text-purple-400" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Translate className="w-4 h-4" />
          <span>Cultural Adaptation</span>
        </div>
        <textarea
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          className="w-full h-32 bg-black/20 rounded-lg p-3 text-white/90 
                   border border-white/10 focus:outline-none focus:border-purple-500/50
                   resize-none"
          placeholder="Enter text to translate..."
        />
      </div>
    </div>
  );
};