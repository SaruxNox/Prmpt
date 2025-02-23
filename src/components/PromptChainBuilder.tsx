import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
} from 'react-flow-renderer';
import { useStore } from '../store/useStore';
import { Workflow, GitBranch, Play, Plus, Save } from 'lucide-react';

const nodeTypes = {
  prompt: ({ data }: { data: { content: string } }) => (
    <div className="bg-black/40 backdrop-blur-xl p-4 rounded-lg border border-white/10">
      <p className="text-sm text-white/90">{data.content}</p>
    </div>
  ),
};

export const PromptChainBuilder: React.FC = () => {
  const { currentPrompt, generateChain } = useStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = (params: Connection) => {
    setEdges((eds) => [...eds, { ...params, animated: true }]);
  };

  const addNode = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'prompt',
      data: { content: currentPrompt },
      position: { x: 100 * (nodes.length + 1), y: 100 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const executeChain = async () => {
    // Implementation for chain execution
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10 h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Workflow className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Prompt Chain Builder</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={addNode}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 
                     hover:bg-purple-500/30 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Node
          </button>
          <button
            onClick={executeChain}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 
                     hover:bg-green-500/30 rounded-md transition-colors"
          >
            <Play className="w-4 h-4" />
            Execute
          </button>
        </div>
      </div>

      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};