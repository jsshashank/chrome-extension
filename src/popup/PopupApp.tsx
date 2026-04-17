import React, { useEffect, useState } from 'react';
import { PlusCircle, Bookmark, CheckCircle2, Globe } from 'lucide-react';
import { useShortcuts } from '../hooks/useShortcuts';

export const PopupApp: React.FC = () => {
  const { addCustomSite, saveForLater, customSites, savedForLater } = useShortcuts();
  const [currentTab, setCurrentTab] = useState<{ title: string; url: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          setCurrentTab({
            title: tabs[0].title || 'Unknown',
            url: tabs[0].url || ''
          });
        }
      });
    }
  }, []);

  const handleAction = (action: 'shortcut' | 'save') => {
    if (!currentTab) return;

    if (action === 'shortcut') {
      if (customSites.length >= 20) {
        setFeedback('Limit of 20 reached');
      } else {
        addCustomSite(currentTab.title, currentTab.url);
        setFeedback('Portal Added');
      }
    } else {
      if (savedForLater.find(s => s.url === currentTab.url)) {
        setFeedback('Already Saved');
      } else {
        saveForLater(currentTab.title, currentTab.url);
        setFeedback('Saved for Later');
      }
    }

    setTimeout(() => {
      setFeedback(null);
      if (action === 'shortcut' && customSites.length < 20) window.close();
      if (action === 'save') window.close();
    }, 1200);
  };

  if (!currentTab) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 bg-[#0f0f12] text-white w-[300px] border border-gray-800/20 shadow-2xl overflow-hidden relative">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-1 px-1">
          <Globe className="w-3 h-3 text-gray-500" />
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-light truncate max-w-[200px]">
            {new URL(currentTab.url || 'https://google.com').hostname.replace('www.', '')}
          </div>
        </div>
        <div className="text-xs font-light text-gray-200 truncate px-1">
          {currentTab.title}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative">
        <button 
          onClick={() => handleAction('shortcut')}
          className="flex flex-col items-center justify-center p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl hover:bg-gray-800/60 hover:border-gray-700/60 transition-all group"
        >
          <PlusCircle className="w-5 h-5 mb-2 text-gray-500 group-hover:text-white transition-colors" />
          <span className="text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-gray-300 font-light text-center">Shortcut</span>
        </button>

        <button 
          onClick={() => handleAction('save')}
          className="flex flex-col items-center justify-center p-4 bg-gray-900/40 border border-gray-800/40 rounded-xl hover:bg-gray-800/60 hover:border-gray-700/60 transition-all group"
        >
          <Bookmark className="w-5 h-5 mb-2 text-gray-500 group-hover:text-white transition-colors" />
          <span className="text-[9px] uppercase tracking-widest text-gray-500 group-hover:text-gray-300 font-light text-center">Save Item</span>
        </button>

        {feedback && (
          <div className="absolute inset-0 bg-[#0f0f12]/95 flex items-center justify-center space-x-3 rounded-xl animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-light text-gray-100">{feedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
