import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, url: string) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newItem, setNewItem] = useState({ title: '', url: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.title && newItem.url) {
      onAdd(newItem.title, newItem.url);
      setNewItem({ title: '', url: '' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md transition-all" onClick={onClose}></div>
      <div className="bg-[#121214]/95 backdrop-blur-2xl border border-gray-800/30 p-8 rounded-[1.5rem] w-full max-w-[480px] relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-100 text-[10px] font-light tracking-[0.5em] uppercase">New Portal</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-100 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="text-[8px] text-gray-600 uppercase tracking-widest ml-0.5 opacity-60">Identity</div>
              <input
                type="text"
                value={newItem.title}
                onChange={e => setNewItem({...newItem, title: e.target.value})}
                placeholder="e.g. Gmail"
                className="w-full bg-gray-900/40 border border-gray-800/40 p-3 rounded-xl text-gray-300 text-xs focus:outline-none focus:border-gray-600 transition-all placeholder:text-gray-800"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-[8px] text-gray-600 uppercase tracking-widest ml-0.5 opacity-60">Endpoint</div>
              <input
                type="text"
                value={newItem.url}
                onChange={e => setNewItem({...newItem, url: e.target.value})}
                placeholder="google.com"
                className="w-full bg-gray-900/40 border border-gray-800/40 p-3 rounded-xl text-gray-300 text-xs focus:outline-none focus:border-gray-600 transition-all placeholder:text-gray-800"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="submit" className="px-8 py-2.5 bg-gray-100 hover:bg-white text-black rounded-lg text-[9px] font-semibold uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-lg shadow-white/5">
              Accept
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
