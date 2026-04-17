import React from 'react';
import { XCircle } from 'lucide-react';

export type SettingsTab = 'about' | 'privacy' | 'shortcuts' | 'changelog' | 'donate';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  if (!isOpen) return null;

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'about', label: 'About Us' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'shortcuts', label: 'Hotkeys' },
    { id: 'changelog', label: 'Updates' },
    { id: 'donate', label: 'Donate' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <section className="space-y-6">
              <h2 className="text-5xl font-extralight tracking-tight text-white">Focus. <span className="text-gray-500 italic">Redefined.</span></h2>
              <p className="text-gray-400 font-light leading-relaxed text-xl max-w-3xl">
                In an era of digital noise, clarity is the ultimate luxury. Minimalist Dark Tab is not just a homepage; it's a cognitive workspace engineered to guard your most precious resource: your attention.
              </p>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/5 pt-16">
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-bold">The Vision</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Most browser homepages are designed to be destinations themselves—filled with news, ads, and suggestions. Our vision is the opposite: a home that helps you leave. We provide the fastest bridge between your intent and your destination.
                </p>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  By removing the "Top Sites" algorithm and replacing it with your own 20-slot curated portal, we ensure you only visit the places that matter to you.
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-bold">The Technical Stack</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Performance is a feature. Built with React 18 and Vite, the extension maintains a near-zero memory footprint. 
                </p>
                <ul className="text-gray-500 text-[10px] space-y-2 uppercase tracking-widest font-medium">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>60FPS GPU Animations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Sub-100ms Hydration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Manifest V3 Architecture</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'shortcuts':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="border-b border-white/5 pb-10">
              <h2 className="text-3xl font-light tracking-tight text-white mb-4">Command Center</h2>
              <p className="text-gray-500 text-sm font-light">Total control without moving your hand to the mouse.</p>
            </header>
            
            <div className="grid gap-6">
              {[
                { key: 'Q', action: 'Activity Engine', desc: 'Opens the dynamic drawer. Group your active tabs by domain and instantly access your 24-hour browsing history.' },
                { key: 'Esc', action: 'The Kill Switch', desc: 'Universal close for settings, modals, and drawers. If you are in Edit Mode, this instantly saves your grid arrangement.' },
                { key: 'Enter', action: 'Primary Action', desc: 'Search the web from our minimalist bar or commit a task to your persistent list.' },
                { key: 'M-Wheel', action: 'Canvas Pivot', desc: 'Scroll up or down anywhere on the page to pivot between your Home Dashboard and your Task Workspace.' },
                { key: 'Pencil', action: 'Rearrange Mode', desc: 'Clicking the pencil icon triggers the "Wiggle" state, allowing you to drag and drop shortcuts into your preferred 10x2 grid.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-8 items-start p-8 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 transition-all group">
                  <kbd className="shrink-0 w-20 h-10 flex items-center justify-center bg-black rounded-xl border border-white/10 text-xs text-emerald-500 font-mono tracking-tighter group-hover:border-emerald-500/40 transition-colors">{s.key}</kbd>
                  <div className="space-y-2">
                    <h5 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-200">{s.action}</h5>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <header className="space-y-4">
                <h2 className="text-3xl font-light tracking-tight text-white">Privacy by Default</h2>
                <div className="h-1 w-20 bg-emerald-500"></div>
             </header>

             <div className="space-y-12">
               <div className="space-y-4">
                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-bold">01. Local Data Residency</h4>
                 <p className="text-gray-400 text-sm font-light leading-relaxed">
                   We do not own your data. All shortcuts, tasks, and settings are stored locally within your Chrome profile using `localStorage` and `chrome.storage.sync`. We never transmit your browsing habits to external servers.
                 </p>
               </div>
               
               <div className="space-y-4">
                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-bold">02. Zero Analytics</h4>
                 <p className="text-gray-400 text-sm font-light leading-relaxed">
                   Unlike most "free" extensions, we do not use Google Analytics, cookies, or tracking pixels. We have no idea which websites you visit or what tasks you set. This is a private sandbox, just for you.
                 </p>
               </div>

               <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                 <h4 className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-bold mb-3">Security Audit</h4>
                 <p className="text-gray-500 text-xs font-light leading-relaxed italic">
                   "Minimalist Dark Tab follows the principle of least privilege. We only request permissions necessary to show your bookmarks and history locally. We never ask for 'read/write' website access."
                 </p>
               </div>
             </div>
          </div>
        );
      case 'changelog':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <h2 className="text-3xl font-light tracking-tight text-white">Engineering Changelog</h2>
             <div className="space-y-16">
               <div className="relative pl-12 border-l-2 border-emerald-500">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0f0f12]"></div>
                 <h4 className="text-lg font-medium text-white mb-2 underline decoration-emerald-500 underline-offset-8">v1.2.0 - The Precision Update</h4>
                 <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-[0.3em] mb-4">Released April 16, 2026</div>
                 <ul className="text-sm text-gray-500 font-light space-y-3">
                   <li>• Re-engineered Shortcut Grid (20-slot capacity, 10x2 layout)</li>
                   <li>• Added "Wiggle" Interactive Rearrangement Mode</li>
                   <li>• Unified Icon Language across Dashboard and Drawer</li>
                   <li>• Integrated Universal Settings Hub and Markdown Docs</li>
                 </ul>
               </div>

               <div className="relative pl-12 border-l-2 border-white/10 opacity-50">
                 <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white/20 border-4 border-[#0f0f12]"></div>
                 <h4 className="text-lg font-medium text-gray-300 mb-2">v1.1.0 - Activity Engine</h4>
                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em] mb-4">Released March 2026</div>
                 <ul className="text-sm text-gray-500 font-light space-y-3">
                   <li>• Implementation of domain-grouped Activity Drawer</li>
                   <li>• Performance optimizations for Large History Sets</li>
                   <li>• Persistent Task List with auto-order logic</li>
                 </ul>
               </div>
             </div>
          </div>
        );
      case 'donate':
        return (
          <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-10 animate-in fade-in zoom-in duration-700">
             <div className="w-32 h-32 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/10 text-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.08)]">
               <span className="text-5xl font-extralight">$</span>
             </div>
             <div className="space-y-4 max-w-lg">
                <h3 className="text-3xl font-light tracking-tight text-white">Fuel the Focus.</h3>
                <p className="text-gray-500 font-light text-base leading-relaxed">
                  Support the development of high-performance, distraction-free tools. Your contribution directly funds new features and professional asset creation for the Minimalist Dark ecosystem.
                </p>
             </div>
             <div className="grid grid-cols-3 gap-6 w-full max-w-xl">
                <button className="p-6 bg-white/[0.03] border border-white/5 text-gray-400 rounded-3xl hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all group">
                   <div className="text-lg font-bold mb-1">$5</div>
                   <div className="text-[9px] uppercase tracking-widest font-bold group-hover:text-white">Coffee</div>
                </button>
                <button className="p-6 bg-white/[0.03] border border-white/5 text-white rounded-3xl hover:bg-emerald-500 hover:border-emerald-400 transition-all group">
                   <div className="text-lg font-bold mb-1">$15</div>
                   <div className="text-[9px] uppercase tracking-widest font-bold group-hover:text-white">Professional</div>
                </button>
                <button className="p-6 bg-white/[0.03] border border-white/5 text-gray-400 rounded-3xl hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all group">
                   <div className="text-lg font-bold mb-1">$50</div>
                   <div className="text-[9px] uppercase tracking-widest font-bold group-hover:text-white">Patron</div>
                </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0f12] flex animate-in slide-in-from-bottom duration-[700ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]">
      {/* Sidebar - Right Aligned Menu */}
      <div className="w-72 border-r border-white/5 h-full p-12 flex flex-col justify-between shrink-0 bg-[#0c0c0e]">
        <div className="space-y-12 flex flex-col items-end">
           <div className="flex items-center space-x-2 opacity-30 justify-end w-full">
              <div className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-medium">Internal</div>
              <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
           </div>
           
           <nav className="flex flex-col space-y-5 w-full">
             {tabs.map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`text-right text-[10px] uppercase tracking-[0.3em] font-light transition-all duration-300 ${activeTab === tab.id ? 'text-white pr-4 border-r-2 border-emerald-500' : 'text-gray-600 hover:text-gray-300 pr-2'}`}
               >
                 {tab.label}
               </button>
             ))}
           </nav>
        </div>
        
        <div className="space-y-1 opacity-20 text-right w-full">
           <div className="text-[8px] text-gray-500 uppercase tracking-[0.2em]">Build v1.2.0</div>
           <div className="text-[8px] text-gray-500 uppercase tracking-[0.2em]">© Focus Lab</div>
        </div>
      </div>

      {/* Main Content - Left Aligned from line */}
      <div className="flex-grow h-full p-16 relative overflow-y-auto custom-scrollbar bg-black/10">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 z-20 text-gray-700 hover:text-red-500 transition-all hover:rotate-90 duration-500"
        >
          <XCircle className="w-8 h-8 font-thin" />
        </button>
        
        <div className="max-w-2xl ml-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
