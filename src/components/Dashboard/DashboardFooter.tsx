import React, { useState } from 'react';
import { SquareMenu, HandHeart } from 'lucide-react';
import { SettingsTab } from './SettingsOverlay';

interface DashboardFooterProps {
  onOpenTab: (tab: SettingsTab) => void;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ onOpenTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: { id: SettingsTab; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'shortcuts', label: 'Hotkeys' },
    { id: 'changelog', label: 'Updates' },
    { id: 'donate', label: 'Donate' }
  ];

  return (
    <div className="fixed bottom-6 left-6 flex items-center space-x-4 z-50">
      <div className="flex items-center space-x-3 text-[9px] text-gray-700 uppercase tracking-widest font-medium opacity-60 hover:opacity-100 transition-opacity">
        <span>v1.2.0</span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-all duration-300 ${isOpen ? 'text-emerald-500 rotate-90' : 'text-gray-600 hover:text-white'}`}
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
        </div>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[-1]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-10 left-0 w-48 bg-[#0f0f12]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onOpenTab(item.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
