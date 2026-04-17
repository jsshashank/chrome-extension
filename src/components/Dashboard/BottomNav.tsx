import React from 'react';
import { ChevronUp, Clock, Star, Download, Settings, History, AppWindow as TabIcon } from 'lucide-react';

interface BottomNavProps {
  onOpenDrawer: () => void;
  navigateTo: (url: string, e?: React.MouseEvent) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenDrawer, navigateTo }) => {
  return (
    <div className="w-full flex items-center justify-center space-x-10 z-10 shrink-0 pb-4">
      <button onClick={onOpenDrawer} className="flex items-center space-x-2 group h-8">
        <TabIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-200 transition-all" />
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-light group-hover:text-gray-200 transition-colors">Tabs</span>
      </button>
      <button onClick={(e) => navigateTo('chrome://history', e)} className="flex items-center space-x-2 group h-8">
        <History className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-200 transition-all" />
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-light group-hover:text-gray-200 transition-colors">History</span>
      </button>
      <button onClick={(e) => navigateTo('chrome://bookmarks', e)} className="flex items-center space-x-2 group h-8">
        <Star className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-200 transition-all" />
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-light group-hover:text-gray-200 transition-colors">Bookmarks</span>
      </button>
      <button onClick={(e) => navigateTo('chrome://downloads', e)} className="flex items-center space-x-2 group h-8">
        <Download className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-200 transition-all" />
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-light group-hover:text-gray-200 transition-colors">Downloads</span>
      </button>
      <button onClick={(e) => navigateTo('chrome://settings', e)} className="flex items-center space-x-2 group h-8">
        <Settings className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-200 transition-all" />
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-light group-hover:text-gray-200 transition-colors">Settings</span>
      </button>
    </div>
  );
};
