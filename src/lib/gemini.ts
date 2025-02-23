import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDJXtMLJqMpys8ReJ6RYsyYtuCHD7f9qKY';

if (!API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generatePromptSuggestions(input: string): Promise<string[]> {
  if (!input.trim()) {
    return [];
  }

  try {
    const prompt = `
      You are an AI prompt engineering expert. Based on this input prompt:
      "${input.trim()}"
      
      Generate 5 relevant keyword suggestions that could improve this prompt.
      Return only single words or short phrases, one per line.
      Be concise and specific.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      console.warn('Empty response from Gemini API');
      return [];
    }

    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && !line.startsWith('*'));
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}

export async function generatePromptVariations(prompt: string): Promise<string[]> {
  if (!prompt.trim()) {
    return [];
  }

  try {
    const result = await model.generateContent(`
      You are an AI prompt engineering expert. Create 3 variations of this prompt:
      "${prompt.trim()}"
      
      Each variation should:
      - Maintain the same core intent
      - Use different phrasing and structure
      - Be clear and specific
      
      Return only the variations, separated by triple dashes (---).
      Do not include any other text or explanations.
    `);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      console.warn('Empty response from Gemini API');
      return [];
    }

    return text.split('---')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  } catch (error) {
    console.error('Error generating variations:', error);
    return [];
  }
}

export async function analyzePromptEffectiveness(prompt: string): Promise<{
  score: number;
  feedback: string[];
}> {
  if (!prompt.trim()) {
    return {
      score: 0,
      feedback: ['Please enter a prompt to analyze'],
    };
  }

  try {
    const result = await model.generateContent(`
      You are an AI prompt engineering expert. Analyze this prompt:
      "${prompt.trim()}"
      
      Provide:
      1. An effectiveness score (0-100)
      2. Three specific pieces of feedback for improvement
      
      Format your response exactly like this:
      SCORE: [number]
      - [feedback1]
      - [feedback2]
      - [feedback3]
      
      Be specific and actionable in your feedback.
      Focus on clarity, specificity, and structure.
    `);
    
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      console.warn('Empty response from Gemini API');
      return {
        score: 0,
        feedback: ['Unable to analyze prompt at this time'],
      };
    }

    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const scoreMatch = lines[0].match(/SCORE:\s*(\d+)/i);
    
    if (!scoreMatch) {
      console.warn('Invalid score format in response:', lines[0]);
      return {
        score: 0,
        feedback: ['Error parsing analysis results'],
      };
    }

    const score = Math.min(100, Math.max(0, parseInt(scoreMatch[1], 10)));
    const feedback = lines
      .slice(1)
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());

    if (feedback.length === 0) {
      feedback.push('Focus on being more specific and clear');
      feedback.push('Consider adding more context');
      feedback.push('Try using more descriptive language');
    }

    return {
      score: isNaN(score) ? 0 : score,
      feedback: feedback.slice(0, 3),
    };
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    return {
      score: 0,
      feedback: ['Unable to analyze prompt. Please try again.'],
    };
  }
}

// New feature: Generate prompt templates based on category
export async function generatePromptTemplates(category: string): Promise<string[]> {
  try {
    const result = await model.generateContent(`
      Generate 3 professional prompt templates for the ${category} category.
      Each template should be detailed and follow best practices.
      Return only the templates, separated by triple dashes (---).
    `);
    const response = await result.response;
    const text = response.text();
    
    return text ? text.split('---').map(t => t.trim()).filter(Boolean) : [];
  } catch (error) {
    console.error('Error generating templates:', error);
    return [];
  }
}

// New feature: Enhance prompt with specific focus
export async function enhancePrompt(prompt: string, focus: 'clarity' | 'creativity' | 'detail' | 'conciseness'): Promise<string> {
  try {
    const result = await model.generateContent(`
      Enhance this prompt focusing on ${focus}:
      "${prompt.trim()}"
      
      Return only the enhanced version.
    `);
    const response = await result.response;
    return response.text() || prompt;
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return prompt;
  }
}

// New feature: Generate prompt chain
export async function generatePromptChain(initialPrompt: string, steps: number = 3): Promise<string[]> {
  try {
    const result = await model.generateContent(`
      Create a chain of ${steps} connected prompts starting with:
      "${initialPrompt.trim()}"
      
      Each prompt should build upon the previous one.
      Return prompts separated by triple dashes (---).
    `);
    const response = await result.response;
    const text = response.text();
    
    return text ? text.split('---').map(p => p.trim()).filter(Boolean) : [];
  } catch (error) {
    console.error('Error generating prompt chain:', error);
    return [];
  }
}

// New feature: Generate prompt with specific tone
export async function generateTonedPrompt(prompt: string, tone: 'professional' | 'casual' | 'academic' | 'creative'): Promise<string> {
  try {
    const result = await model.generateContent(`
      Rewrite this prompt in a ${tone} tone:
      "${prompt.trim()}"
      
      Return only the rewritten version.
    `);
    const response = await result.response;
    return response.text() || prompt;
  } catch (error) {
    console.error('Error adjusting tone:', error);
    return prompt;
  }
}