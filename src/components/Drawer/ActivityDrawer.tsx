import React from 'react';
import { AppWindow as TabIcon, History, BookmarkIcon, XCircle } from 'lucide-react';
import { ActiveTab, HistoryItem, Site } from '../../types';

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTabs: ActiveTab[];
  recentHistory: HistoryItem[];
  savedForLater: Site[];
  tabsByDomain: Record<string, ActiveTab[]>;
  navigateTo: (url: string) => void;
  closeTab: (id: number) => void;
  removeSaved: (url: string) => void;
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({
  isOpen,
  onClose,
  recentHistory,
  savedForLater,
  tabsByDomain,
  navigateTo,
  closeTab,
  removeSaved
}) => {
  return (
    <div 
      className={`fixed inset-0 z-[120] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}
    >
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>
      <div 
        className={`absolute bottom-0 left-0 w-full h-[75vh] bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-gray-800/40 shadow-[0_-20px_100px_rgba(0,0,0,0.8)] transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] p-12 py-10 flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-hidden grid grid-cols-3 gap-16">
          {/* LEFT: ACTIVE TABS */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center space-x-3 mb-8 shrink-0">
              <TabIcon className="w-4 h-4 text-emerald-500/60" />
              <h3 className="text-xs font-light tracking-[0.4em] text-gray-400 uppercase">Active Tabs</h3>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-6 space-y-8">
              {Object.entries(tabsByDomain).map(([domain, domainTabs]) => (
                <div key={domain} className="space-y-3">
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-medium pl-1 flex items-center justify-between">
                    {domain}
                    <span className="text-[8px] bg-gray-800/40 px-1.5 py-0.5 rounded-md">{domainTabs.length}</span>
                  </div>
                  <div className="space-y-2 border-l border-gray-800/20 ml-1 pl-4">
                    {domainTabs.map(tab => (
                      <div key={tab.id} className="group flex items-center justify-between py-1.5 hover:bg-gray-800/5 transition-colors pl-2 rounded-lg pr-2 relative">
                        <button 
                          onClick={() => navigateTo(tab.url)}
                          className="text-[11px] text-gray-400 hover:text-gray-100 transition-colors truncate max-w-[180px] font-light"
                        >
                          {tab.title}
                        </button>
                        <button 
                          onClick={() => closeTab(tab.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500/60 transition-all p-1"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE: RECENT HISTORY */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center space-x-3 mb-8 shrink-0">
              <History className="w-4 h-4 text-blue-500/60" />
              <h3 className="text-xs font-light tracking-[0.4em] text-gray-400 uppercase">Recently Visited</h3>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-6 space-y-4">
              {recentHistory.map((item, i) => (
                <div key={i} className="group flex flex-col py-2 border-b border-gray-800/10 last:border-0">
                  <button 
                    onClick={() => navigateTo(item.url)}
                    className="text-[11px] text-gray-300 hover:text-white transition-colors text-left truncate font-light mb-1"
                  >
                    {item.title}
                  </button>
                  <span className="text-[8px] text-gray-600 uppercase tracking-tighter truncate opacity-60">
                    {new URL(item.url || 'http://unknown').hostname}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SAVED FOR LATER */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center space-x-3 mb-8 shrink-0">
              <BookmarkIcon className="w-4 h-4 text-purple-500/60" />
              <h3 className="text-xs font-light tracking-[0.4em] text-gray-400 uppercase">Saved for later</h3>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-6 space-y-4">
              {savedForLater.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <BookmarkIcon className="w-8 h-8 mb-4 font-light" />
                  <span className="text-[10px] uppercase tracking-widest font-light">Empty</span>
                </div>
              ) : (
                savedForLater.map((item, i) => (
                  <div key={i} className="group flex flex-col py-2 border-b border-gray-800/10 last:border-0 relative">
                    <button 
                      onClick={() => navigateTo(item.url)}
                      className="text-[11px] text-gray-300 hover:text-white transition-colors text-left truncate font-light mb-1 pr-6"
                    >
                      {item.title}
                    </button>
                    <span className="text-[8px] text-gray-600 uppercase tracking-tighter truncate opacity-60">
                      {new URL(item.url || 'http://unknown').hostname}
                    </span>
                    <button 
                      onClick={() => removeSaved(item.url)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500/60 transition-all"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
