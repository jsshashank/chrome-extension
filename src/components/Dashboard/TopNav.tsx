import React from 'react';
import { Plus, HatGlasses, Pencil, Check } from 'lucide-react';
import { BookmarkLink } from '../../types';

interface TopNavProps {
  bookmarkBar: BookmarkLink[];
  navigateTo: (url: string, e?: React.MouseEvent) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ bookmarkBar, navigateTo, isEditing, onToggleEdit }) => {
  return (
    <div className="w-full max-w-[98%] flex justify-between items-start z-10 shrink-0">
      <div className="flex items-center space-x-6 pt-2 overflow-x-auto no-scrollbar max-w-[70%]">
        <button 
          onClick={onToggleEdit}
          className={`mr-2 transition-all duration-300 ${isEditing ? 'text-emerald-500 scale-110' : 'text-gray-600 hover:text-gray-300'}`}
          title={isEditing ? "Save Arrangement" : "Edit Shortcuts"}
        >
          {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
        </button>
        {bookmarkBar.map((bm, i) => (
          <button 
            key={i} 
            onClick={(e) => navigateTo(bm.url, e)} 
            className="text-gray-400 hover:text-gray-200 transition-all whitespace-nowrap"
          >
            <span className="text-[9px] font-light tracking-widest uppercase">{bm.title}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-6 pt-2">
        <button onClick={() => chrome.tabs.create({})} className="text-gray-500 hover:text-gray-200 transition-colors" title="New Tab">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={() => chrome.windows.create({ incognito: true })} className="text-gray-500 hover:text-gray-200 transition-colors" title="New Incognito Window">
          <HatGlasses className="w-4 h-4" />
        </button>
        <button onClick={(e) => navigateTo('https://mail.google.com', e)} className="text-gray-400 hover:text-gray-200 text-[10px] font-light tracking-widest uppercase transition-colors">Gmail</button>
        <button onClick={(e) => navigateTo('https://www.google.com/imghp', e)} className="text-gray-400 hover:text-gray-200 text-[10px] font-light tracking-widest uppercase transition-colors">Images</button>
      </div>
    </div>
  );
};
