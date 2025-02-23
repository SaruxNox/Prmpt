import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { Prompt, UserSettings, Suggestion, PromptAnalysis, PromptTemplate, PromptChain } from '../types';
import {
  generatePromptSuggestions,
  analyzePromptEffectiveness,
  generatePromptVariations,
  generatePromptTemplates,
  enhancePrompt,
  generatePromptChain,
  generateTonedPrompt,
} from '../lib/gemini';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

// Generate 100 preset prompts
const generatePresetPrompts = (): Prompt[] => {
  const prompts: Prompt[] = [
    // Creative Writing
    {
      id: 'creative-story-1',
      content: 'Write a compelling story about a character who discovers they can communicate with plants, focusing on their first interaction with a ancient tree.',
      effectiveness: 92,
      category: 'Creative',
      tags: ['storytelling', 'fantasy', 'nature'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      feedback: ['Clear narrative focus', 'Unique concept', 'Good emotional hook'],
      featured: true,
      likes: 156,
      usageCount: 342,
      complexity: 'intermediate',
      language: 'English',
      examples: ['Once upon a time in a forgotten garden...']
    },
    // Add 30 new prompts
    {
      id: 'world-building-1',
      content: 'Create a detailed description of a floating city in the sky, including its architecture, transportation systems, and daily life of its inhabitants.',
      effectiveness: 95,
      category: 'Creative',
      tags: ['worldbuilding', 'fantasy', 'description'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'character-design-1',
      content: 'Design a unique superhero whose powers are based on sound waves. Describe their appearance, abilities, and limitations.',
      effectiveness: 88,
      category: 'Creative',
      tags: ['character', 'superhero', 'design'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'scene-description-1',
      content: 'Describe a bustling marketplace in a steampunk version of Victorian London, focusing on all five senses.',
      effectiveness: 90,
      category: 'Creative',
      tags: ['description', 'steampunk', 'setting'],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'dialogue-prompt-1',
      content: 'Write a dialogue between two time travelers who meet in different eras throughout history, maintaining their evolving relationship.',
      effectiveness: 87,
      category: 'Creative',
      tags: ['dialogue', 'timetravel', 'relationship'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'poetry-prompt-1',
      content: 'Compose a poem about the last sunset on Earth, using vivid imagery and metaphors.',
      effectiveness: 85,
      category: 'Creative',
      tags: ['poetry', 'apocalyptic', 'imagery'],
      createdAt: new Date('2024-01-06'),
      updatedAt: new Date('2024-01-06'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'adventure-prompt-1',
      content: 'Create an exciting chase scene through an ancient temple filled with magical traps and mysteries.',
      effectiveness: 89,
      category: 'Creative',
      tags: ['adventure', 'action', 'fantasy'],
      createdAt: new Date('2024-01-07'),
      updatedAt: new Date('2024-01-07'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'mystery-prompt-1',
      content: 'Write a mystery story where the detective can only solve crimes by interpreting people\'s dreams.',
      effectiveness: 91,
      category: 'Creative',
      tags: ['mystery', 'supernatural', 'detective'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'horror-prompt-1',
      content: 'Describe a haunted painting that shows a different scene to each person who views it, revealing their deepest fears.',
      effectiveness: 93,
      category: 'Creative',
      tags: ['horror', 'psychological', 'supernatural'],
      createdAt: new Date('2024-01-09'),
      updatedAt: new Date('2024-01-09'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'scifi-prompt-1',
      content: 'Write about a society where memories can be traded like currency, exploring the implications and consequences.',
      effectiveness: 94,
      category: 'Creative',
      tags: ['scifi', 'society', 'concept'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'romance-prompt-1',
      content: 'Create a love story between two rival street artists who communicate through their murals.',
      effectiveness: 86,
      category: 'Creative',
      tags: ['romance', 'art', 'urban'],
      createdAt: new Date('2024-01-11'),
      updatedAt: new Date('2024-01-11'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'fantasy-prompt-1',
      content: 'Design a magical library where books come to life at night and interact with each other.',
      effectiveness: 92,
      category: 'Creative',
      tags: ['fantasy', 'magic', 'books'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'historical-prompt-1',
      content: 'Write a story about a time-lost Viking who finds himself in modern-day New York City.',
      effectiveness: 88,
      category: 'Creative',
      tags: ['historical', 'fish-out-of-water', 'culture-clash'],
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'adventure-prompt-2',
      content: 'Create an underwater civilization living in the ruins of a sunken modern city.',
      effectiveness: 90,
      category: 'Creative',
      tags: ['adventure', 'post-apocalyptic', 'worldbuilding'],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'mystery-prompt-2',
      content: 'Write about a detective who can only solve crimes by tasting objects at the crime scene.',
      effectiveness: 87,
      category: 'Creative',
      tags: ['mystery', 'unique-ability', 'investigation'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'fantasy-prompt-2',
      content: 'Design a magical cooking competition where ingredients have unexpected magical properties.',
      effectiveness: 89,
      category: 'Creative',
      tags: ['fantasy', 'cooking', 'competition'],
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'scifi-prompt-2',
      content: 'Create a story about the last tree on Earth and the people trying to protect it.',
      effectiveness: 91,
      category: 'Creative',
      tags: ['scifi', 'environmental', 'future'],
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'horror-prompt-2',
      content: 'Write about a person who discovers their reflection has started moving independently.',
      effectiveness: 93,
      category: 'Creative',
      tags: ['horror', 'psychological', 'supernatural'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'romance-prompt-2',
      content: 'Create a love story between two people who can only meet in their shared dreams.',
      effectiveness: 88,
      category: 'Creative',
      tags: ['romance', 'dreams', 'fantasy'],
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'adventure-prompt-3',
      content: 'Design a treasure hunt through a city where all the clues are hidden in street art.',
      effectiveness: 86,
      category: 'Creative',
      tags: ['adventure', 'urban', 'mystery'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'fantasy-prompt-3',
      content: 'Write about a world where music is visible and musicians paint the air with their melodies.',
      effectiveness: 92,
      category: 'Creative',
      tags: ['fantasy', 'music', 'visual'],
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-21'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'scifi-prompt-3',
      content: 'Create a story about a city where gravity reverses direction every 12 hours.',
      effectiveness: 90,
      category: 'Creative',
      tags: ['scifi', 'worldbuilding', 'concept'],
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'mystery-prompt-3',
      content: 'Write a mystery where all the suspects are different versions of the same person from parallel universes.',
      effectiveness: 94,
      category: 'Creative',
      tags: ['mystery', 'parallel-universe', 'complex'],
      createdAt: new Date('2024-01-23'),
      updatedAt: new Date('2024-01-23'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'horror-prompt-3',
      content: 'Design a haunted social media platform where likes drain users\' life force.',
      effectiveness: 89,
      category: 'Creative',
      tags: ['horror', 'modern', 'social-media'],
      createdAt: new Date('2024-01-24'),
      updatedAt: new Date('2024-01-24'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'fantasy-prompt-4',
      content: 'Create a story about a library where books can only be read by experiencing them in dreams.',
      effectiveness: 91,
      category: 'Creative',
      tags: ['fantasy', 'dreams', 'books'],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'adventure-prompt-4',
      content: 'Write about an expedition to explore a giant mechanical creature that appeared in the desert.',
      effectiveness: 93,
      category: 'Creative',
      tags: ['adventure', 'mystery', 'mechanical'],
      createdAt: new Date('2024-01-26'),
      updatedAt: new Date('2024-01-26'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'scifi-prompt-4',
      content: 'Design a future sport that combines virtual reality and parkour across city skyscrapers.',
      effectiveness: 88,
      category: 'Creative',
      tags: ['scifi', 'sports', 'virtual-reality'],
      createdAt: new Date('2024-01-27'),
      updatedAt: new Date('2024-01-27'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'mystery-prompt-4',
      content: 'Create a locked-room mystery where the room keeps changing its dimensions and layout.',
      effectiveness: 90,
      category: 'Creative',
      tags: ['mystery', 'supernatural', 'puzzle'],
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-01-28'),
      complexity: 'advanced',
      language: 'English'
    },
    {
      id: 'fantasy-prompt-5',
      content: 'Write about a magical restaurant where each dish reveals a memory from the eater\'s past.',
      effectiveness: 87,
      category: 'Creative',
      tags: ['fantasy', 'food', 'memories'],
      createdAt: new Date('2024-01-29'),
      updatedAt: new Date('2024-01-29'),
      complexity: 'intermediate',
      language: 'English'
    },
    {
      id: 'horror-prompt-4',
      content: 'Design a story about a person who discovers their shadow is collecting other people\'s shadows.',
      effectiveness: 92,
      category: 'Creative',
      tags: ['horror', 'supernatural', 'dark'],
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-01-30'),
      complexity: 'intermediate',
      language: 'English'
    }
  ];

  return prompts;
};

const presetPrompts = generatePresetPrompts();

interface Store {
  prompts: Prompt[];
  savedPrompts: Prompt[];
  currentPrompt: string;
  settings: UserSettings;
  effectiveness: number;
  suggestions: Suggestion[];
  variations: string[];
  feedback: string[];
  categories: string[];
  isAnalyzing: boolean;
  favoritePrompts: Set<string>;
  promptHistory: string[];
  templates: PromptTemplate[];
  chains: PromptChain[];
  analysis: PromptAnalysis | null;
  collaborators: Map<string, string[]>;
  
  setCurrentPrompt: (prompt: string) => void;
  updateEffectiveness: (score: number) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  setVariations: (variations: string[]) => void;
  setFeedback: (feedback: string[]) => void;
  savePrompt: (prompt: string) => void;
  deletePrompt: (id: string) => void;
  searchPrompts: (term: string) => void;
  filterPrompts: (category: string) => void;
  copyToEditor: (content: string) => void;
  analyzePrompt: (prompt: string) => Promise<void>;
  generateSuggestions: (input: string) => Promise<void>;
  generateVariations: (prompt: string) => Promise<void>;
  toggleFavorite: (promptId: string) => void;
  addToHistory: (prompt: string) => void;
  clearHistory: () => void;
  getFeaturedPrompts: () => Prompt[];
  getMostUsedPrompts: () => Prompt[];
  getRelatedPrompts: (promptId: string) => Prompt[];
  
  createTemplate: (template: Omit<PromptTemplate, 'id'>) => void;
  createChain: (chain: Omit<PromptChain, 'id'>) => void;
  enhancePromptWithFocus: (focus: 'clarity' | 'creativity' | 'detail' | 'conciseness') => Promise<void>;
  generateTemplatesForCategory: (category: string) => Promise<void>;
  adjustPromptTone: (tone: 'professional' | 'casual' | 'academic' | 'creative') => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      prompts: [],
      savedPrompts: presetPrompts,
      currentPrompt: '',
      effectiveness: 0,
      suggestions: [],
      variations: [],
      feedback: [],
      isAnalyzing: false,
      categories: ['Creative', 'Technical', 'Business', 'Academic', 'Marketing', 'Scientific', 'Educational'],
      favoritePrompts: new Set<string>(),
      promptHistory: [],
      templates: [],
      chains: [],
      analysis: null,
      collaborators: new Map(),
      settings: {
        theme: 'nebula',
        soundEnabled: true,
        animationsEnabled: true,
        experience: 'intermediate',
        defaultCategory: 'Creative',
        defaultLanguage: 'English',
        aiModel: 'GPT-4',
        customTags: [],
        favoritePrompts: [],
        promptHistory: [],
        notificationPreferences: {
          success: true,
          error: true,
          info: true,
        },
      },
      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
      updateEffectiveness: (score) => set({ effectiveness: score }),
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setSuggestions: (suggestions) => set({ suggestions }),
      setVariations: (variations) => set({ variations }),
      setFeedback: (feedback) => set({ feedback }),
      savePrompt: (prompt) => {
        const newPrompt: Prompt = {
          id: crypto.randomUUID(),
          content: prompt,
          effectiveness: get().effectiveness,
          category: get().settings.defaultCategory || 'Other',
          tags: get().suggestions.slice(0, 3).map(s => s.text),
          createdAt: new Date(),
          updatedAt: new Date(),
          feedback: get().feedback,
          aiModel: get().settings.aiModel,
          language: get().settings.defaultLanguage,
          complexity: get().settings.experience,
        };
        
        set((state) => ({
          savedPrompts: [...state.savedPrompts, newPrompt],
        }));
        
        toast.success('Prompt saved to library');
      },
      deletePrompt: (id) => {
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((p) => p.id !== id),
          favoritePrompts: new Set(
            Array.from(state.favoritePrompts).filter((promptId) => promptId !== id)
          ),
        }));
        toast.success('Prompt deleted');
      },
      searchPrompts: (term) => {
        if (!term.trim()) {
          set((state) => ({
            savedPrompts: presetPrompts,
          }));
          return;
        }

        const searchTerm = term.toLowerCase();
        const filtered = presetPrompts.filter((prompt) => 
          prompt.content.toLowerCase().includes(searchTerm) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          prompt.category.toLowerCase().includes(searchTerm) ||
          prompt.language?.toLowerCase().includes(searchTerm) ||
          prompt.complexity?.toLowerCase().includes(searchTerm)
        );

        set((state) => ({
          savedPrompts: filtered,
        }));
      },
      filterPrompts: (category) => {
        if (category === 'all') {
          set((state) => ({
            savedPrompts: presetPrompts,
          }));
          return;
        }

        const filtered = presetPrompts.filter(
          (prompt) => prompt.category === category
        );

        set((state) => ({
          savedPrompts: filtered,
        }));
      },
      copyToEditor: (content) => {
        set({ currentPrompt: content });
        get().addToHistory(content);
        toast.success('Prompt copied to editor');
      },
      analyzePrompt: async (prompt) => {
        set({ isAnalyzing: true });
        try {
          const { score, feedback } = await analyzePromptEffectiveness(prompt);
          set({
            effectiveness: score,
            feedback,
            isAnalyzing: false,
          });
        } catch (error) {
          set({ isAnalyzing: false });
          console.error('Error analyzing prompt:', error);
          toast.error('Failed to analyze prompt');
        }
      },
      generateSuggestions: async (input) => {
        try {
          const keywords = await generatePromptSuggestions(input);
          const suggestions = keywords.map((text, index) => ({
            id: `suggestion-${index}`,
            text,
            type: 'keyword' as const,
            score: Math.random() * 100,
            category: get().settings.defaultCategory,
            confidence: Math.random() * 100,
            examples: [`Example for ${text}`],
          }));
          set({ suggestions });
        } catch (error) {
          console.error('Error generating suggestions:', error);
          toast.error('Failed to generate suggestions');
        }
      },
      generateVariations: async (prompt) => {
        try {
          const variations = await generatePromptVariations(prompt);
          set({ variations });
          if (variations.length > 0) {
            toast.success('Generated new variations');
          }
        } catch (error) {
          console.error('Error generating variations:', error);
          toast.error('Failed to generate variations');
        }
      },
      toggleFavorite: (promptId) => {
        set((state) => {
          const newFavorites = new Set(state.favoritePrompts);
          if (newFavorites.has(promptId)) {
            newFavorites.delete(promptId);
          } else {
            newFavorites.add(promptId);
          }
          return { favoritePrompts: newFavorites };
        });
      },
      addToHistory: (prompt) => {
        set((state) => ({
          promptHistory: [prompt, ...state.promptHistory.slice(0, 49)], // Keep last 50 prompts
        }));
      },
      clearHistory: () => {
        set({ promptHistory: [] });
      },
      getFeaturedPrompts: () => {
        return get().savedPrompts.filter((prompt) => prompt.featured);
      },
      getMostUsedPrompts: () => {
        return [...get().savedPrompts]
          .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
          .slice(0, 10);
      },
      getRelatedPrompts: (promptId) => {
        const prompt = get().savedPrompts.find((p) => p.id === promptId);
        if (!prompt?.relatedPrompts) return [];
        return get().savedPrompts.filter((p) => 
          prompt.relatedPrompts?.includes(p.id)
        );
      },
      createTemplate: (template) => {
        set(produce((state) => {
          state.templates.push({
            ...template,
            id: nanoid(),
          });
        }));
      },
      createChain: (chain) => {
        set(produce((state) => {
          state.chains.push({
            ...chain,
            id: nanoid(),
          });
        }));
      },
      enhancePromptWithFocus: async (focus) => {
        const currentPrompt = get().currentPrompt;
        if (!currentPrompt.trim()) return;

        try {
          const enhanced = await enhancePrompt(currentPrompt, focus);
          set({ currentPrompt: enhanced });
          toast.success('Prompt enhanced successfully');
        } catch (error) {
          toast.error('Failed to enhance prompt');
        }
      },
      generateTemplatesForCategory: async (category) => {
        try {
          const templates = await generatePromptTemplates(category);
          set(produce((state) => {
            templates.forEach((content) => {
              state.templates.push({
                id: nanoid(),
                name: `${category} Template`,
                description: 'Auto-generated template',
                category,
                content,
                variables: [],
                createdAt: new Date(),
              });
            });
          }));
          toast.success('Templates generated successfully');
        } catch (error) {
          toast.error('Failed to generate templates');
        }
      },
      adjustPromptTone: async (tone) => {
        const currentPrompt = get().currentPrompt;
        if (!currentPrompt.trim()) return;

        try {
          const adjusted = await generateTonedPrompt(currentPrompt, tone);
          set({ currentPrompt: adjusted });
          toast.success('Prompt tone adjusted');
        } catch (error) {
          toast.error('Failed to adjust prompt tone');
        }
      },
    }),
    {
      name: 'nebula-storage',
      partialize: (state) => ({
        savedPrompts: state.savedPrompts,
        settings: state.settings,
        favoritePrompts: Array.from(state.favoritePrompts),
        promptHistory: state.promptHistory,
        templates: state.templates,
        chains: state.chains,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.favoritePrompts)) {
          state.favoritePrompts = new Set(state.favoritePrompts);
        }
      },
    }
  )
);