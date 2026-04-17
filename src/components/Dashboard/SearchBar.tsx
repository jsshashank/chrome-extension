import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch }) => {
  return (
    <form onSubmit={onSearch} className="w-full max-w-xl relative mb-12">
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Something..."
          className="w-full bg-[#1a1a1f]/60 border border-gray-800/40 rounded-full pl-14 pr-6 py-4 text-gray-200 placeholder-gray-700 focus:outline-none focus:border-gray-700/50 transition-all duration-300 font-light text-base"
        />
      </div>
    </form>
  );
};
