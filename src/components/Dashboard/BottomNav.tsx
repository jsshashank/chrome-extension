import React, { useState } from 'react';
import { Settings, History, AppWindow as TabIcon, Star, Download, SquareMenu, HandHeart } from 'lucide-react';
import { SettingsTab } from './SettingsOverlay';

interface BottomNavProps {
  onOpenDrawer: () => void;
  navigateTo: (url: string, e?: React.MouseEvent) => void;
  onOpenTab: (tab: SettingsTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenDrawer, navigateTo, onOpenTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: { id: SettingsTab; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'shortcuts', label: 'Hotkeys' },
    { id: 'changelog', label: 'Updates' },
    { id: 'donate', label: 'Donate' }
  ];

  return (
    <div className="fixed bottom-8 w-full flex items-center justify-end z-50 px-8">
      <div className="flex items-center space-x-6 h-8">
        {/* Nav Icons Group */}
        <div className="flex items-center space-x-5">
          <button onClick={onOpenDrawer} className="group flex items-center justify-center">
            <TabIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-500 transition-all" />
          </button>
          <button onClick={(e) => navigateTo('chrome://history', e)} className="group flex items-center justify-center">
            <History className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-500 transition-all" />
          </button>
          <button onClick={(e) => navigateTo('chrome://bookmarks', e)} className="group flex items-center justify-center">
            <Star className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-500 transition-all" />
          </button>
          <button onClick={(e) => navigateTo('chrome://downloads', e)} className="group flex items-center justify-center">
            <Download className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-500 transition-all" />
          </button>
          <button onClick={(e) => navigateTo('chrome://settings', e)} className="group flex items-center justify-center">
            <Settings className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-500 transition-all" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-3 bg-white/10"></div>

        {/* Info & Support Group */}
        <div className="flex items-center space-x-3 text-[9px] text-gray-700 uppercase tracking-widest font-medium transition-opacity">
          <span className="opacity-40 select-none">v1.2.0</span>
          <div className="flex items-center space-x-2 relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-all duration-300 ${isMenuOpen ? 'text-emerald-500' : 'text-gray-600 hover:text-white'}`}
            >
              <SquareMenu className="w-3.5 h-3.5" />
            </button>
            
            <a 
              href="https://www.buymeacoffee.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-rose-400 transition-all duration-300"
            >
              <HandHeart className="w-3.5 h-3.5" />
            </a>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute bottom-8 right-0 w-40 bg-[#0f0f12]/95 backdrop-blur-2xl border border-white/5 rounded-2xl p-1 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 z-20">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onOpenTab(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-1.5 text-[8px] uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
