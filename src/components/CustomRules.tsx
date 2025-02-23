import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Trash2, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Rule {
  id: string;
  name: string;
  condition: string;
  message: string;
  enabled: boolean;
}

export const CustomRules: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const { currentPrompt } = useStore();

  const addRule = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      name: 'New Rule',
      condition: '',
      message: '',
      enabled: true,
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const validatePrompt = () => {
    const violations = rules.filter(rule => {
      if (!rule.enabled) return false;
      try {
        return new RegExp(rule.condition).test(currentPrompt);
      } catch (e) {
        return false;
      }
    });
    return violations;
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Custom Rules</h3>
        </div>
        
        <button
          onClick={addRule}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 
                   hover:bg-purple-500/30 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 rounded-lg p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={rule.name}
                onChange={(e) => {
                  setRules(rules.map(r =>
                    r.id === rule.id ? { ...r, name: e.target.value } : r
                  ));
                }}
                className="bg-transparent border-none text-white focus:outline-none"
                placeholder="Rule Name"
              />
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`p-1 rounded-md transition-colors ${
                    rule.enabled ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {rule.enabled ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <input
              type="text"
              value={rule.condition}
              onChange={(e) => {
                setRules(rules.map(r =>
                  r.id === rule.id ? { ...r, condition: e.target.value } : r
                ));
              }}
              className="w-full bg-black/20 rounded-md px-3 py-2 text-sm text-white/90 
                       border border-white/10 focus:outline-none focus:border-purple-500/50 mb-2"
              placeholder="Condition (regex)"
            />

            <input
              type="text"
              value={rule.message}
              onChange={(e) => {
                setRules(rules.map(r =>
                  r.id === rule.id ? { ...r, message: e.target.value } : r
                ));
              }}
              className="w-full bg-black/20 rounded-md px-3 py-2 text-sm text-white/90 
                       border border-white/10 focus:outline-none focus:border-purple-500/50"
              placeholder="Violation message"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};