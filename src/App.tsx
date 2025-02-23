import React from 'react';
import { Background } from './components/Background';
import { PromptEditor } from './components/PromptEditor';
import { Library } from './components/Library';
import { Toaster } from 'sonner';
import { PromptVersionControl } from './components/PromptVersionControl';
import { PromptChainBuilder } from './components/PromptChainBuilder';
import { CustomRules } from './components/CustomRules';
import { PromptOptimizationAssistant } from './components/PromptOptimizationAssistant';
import { ImportExport } from './components/ImportExport';
import { CustomCategories } from './components/CustomCategories';
import { PromptGenerationAssistant } from './components/PromptGenerationAssistant';
import { AdvancedFormatting } from './components/AdvancedFormatting';
import { PromptQualityScore } from './components/PromptQualityScore';
import { PromptLocalization } from './components/PromptLocalization';
import { IntegrationAPI } from './components/IntegrationAPI';
import { SmartRecommendations } from './components/SmartRecommendations';

function App() {
  return (
    <div className="min-h-screen text-white">
      <Background />
      
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Project Nebula
          </h1>
          <p className="text-xl text-white/80">
            Next-Generation AI Prompt Engineering Suite
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <PromptEditor />
            <PromptChainBuilder />
            <CustomRules />
            <AdvancedFormatting />
          </div>
          
          <div className="lg:col-span-4 space-y-8">
            <PromptVersionControl />
            <PromptOptimizationAssistant />
            <PromptGenerationAssistant />
            <PromptQualityScore />
            <SmartRecommendations />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Library />
          <div className="space-y-8">
            <ImportExport />
            <CustomCategories />
            <PromptLocalization />
            <IntegrationAPI />
          </div>
        </div>
      </main>
      
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

export default App;