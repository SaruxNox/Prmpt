import React from 'react';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-white/40" />
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black/30 rounded-lg px-3 py-2 text-white border border-white/10
                 focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer
                 hover:bg-black/40 transition-colors"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};