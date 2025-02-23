import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Code, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';

export const IntegrationAPI: React.FC = () => {
  const { currentPrompt } = useStore();

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/prompts',
      description: 'Create a new prompt',
      example: `
curl -X POST https://api.nebula.ai/prompts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "${currentPrompt}"}'
      `,
    },
    {
      method: 'GET',
      path: '/api/prompts',
      description: 'List all prompts',
      example: `
curl https://api.nebula.ai/prompts \\
  -H "Authorization: Bearer YOUR_API_KEY"
      `,
    },
    {
      method: 'PUT',
      path: '/api/prompts/:id',
      description: 'Update a prompt',
      example: `
curl -X PUT https://api.nebula.ai/prompts/123 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Updated prompt"}'
      `,
    },
  ];

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Terminal className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">API Integration</h3>
      </div>

      <div className="space-y-6">
        {apiEndpoints.map((endpoint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/20 rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono px-2 py-1 rounded ${
                  endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                  endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {endpoint.method}
                </span>
                <span className="text-sm text-white/80">{endpoint.path}</span>
              </div>
              <button
                className="p-1 hover:bg-white/10 rounded transition-colors"
                onClick={() => navigator.clipboard.writeText(endpoint.example)}
              >
                <Copy className="w-4 h-4 text-white/60" />
              </button>
            </div>
            
            <p className="text-sm text-white/60 mb-3">{endpoint.description}</p>
            
            <pre className="bg-black/40 rounded-lg p-3 text-sm font-mono text-white/80 overflow-x-auto">
              {endpoint.example}
            </pre>
          </motion.div>
        ))}

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
          <a
            href="/docs"
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
          >
            <Code className="w-4 h-4" />
            View Full Documentation
          </a>
          <a
            href="/playground"
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
          >
            <ExternalLink className="w-4 h-4" />
            API Playground
          </a>
        </div>
      </div>
    </div>
  );
};