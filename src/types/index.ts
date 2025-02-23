export interface Prompt {
  id: string;
  content: string;
  effectiveness: number;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  feedback?: string[];
  featured?: boolean;
  likes?: number;
  usageCount?: number;
  aiModel?: string;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  examples?: string[];
  relatedPrompts?: string[];
  tone?: 'professional' | 'casual' | 'academic' | 'creative';
  chain?: string[];
  enhancementFocus?: 'clarity' | 'creativity' | 'detail' | 'conciseness';
  templates?: string[];
  version?: number;
  lastModifiedBy?: string;
  collaborators?: string[];
  isPublic?: boolean;
  views?: number;
  rating?: number;
  comments?: Comment[];
  metadata?: Record<string, unknown>;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: number;
}

export interface PromptVariation extends Prompt {
  parentId: string;
  generation: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'nebula' | 'cosmic';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  experience: 'beginner' | 'intermediate' | 'advanced';
  defaultCategory?: string;
  defaultLanguage?: string;
  aiModel?: string;
  customTags?: string[];
  favoritePrompts?: string[];
  promptHistory?: string[];
  notificationPreferences?: {
    success: boolean;
    error: boolean;
    info: boolean;
  };
  defaultTone?: 'professional' | 'casual' | 'academic' | 'creative';
  defaultEnhancementFocus?: 'clarity' | 'creativity' | 'detail' | 'conciseness';
  autoSave?: boolean;
  collaborationEnabled?: boolean;
  publicProfile?: boolean;
  emailNotifications?: boolean;
  customTemplates?: string[];
}

export interface Suggestion {
  id: string;
  text: string;
  type: 'keyword' | 'concept' | 'structure' | 'template' | 'enhancement';
  score: number;
  category?: string;
  source?: string;
  confidence?: number;
  examples?: string[];
  metadata?: {
    tone?: string;
    complexity?: string;
    focus?: string;
    usage?: number;
    effectiveness?: number;
  };
}

export interface PromptAnalysis {
  score: number;
  feedback: string[];
  metrics: {
    clarity: number;
    creativity: number;
    specificity: number;
    effectiveness: number;
  };
  suggestions: Suggestion[];
  tone?: string;
  complexity?: string;
  targetAudience?: string;
  estimatedLength?: number;
  keywords?: string[];
  categories?: string[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  variables: string[];
  example?: string;
  metadata?: Record<string, unknown>;
}

export interface PromptChain {
  id: string;
  name: string;
  steps: Prompt[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  description?: string;
  isActive?: boolean;
}