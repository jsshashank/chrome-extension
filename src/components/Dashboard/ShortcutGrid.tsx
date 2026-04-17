import React from 'react';
import { Plus, MinusCircle } from 'lucide-react';
import { Site } from '../../types';

interface ShortcutGridProps {
  sites: Site[];
  onRemove: (index: number) => void;
  onOpenModal: () => void;
  maxCount: number;
  isEditing: boolean;
  onReorder: (newSites: Site[]) => void;
}

export const ShortcutGrid: React.FC<ShortcutGridProps> = ({ 
  sites, 
  onRemove, 
  onOpenModal,
  maxCount,
  isEditing,
  onReorder
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    if (!isEditing) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Smoothly swap positions
    const newSites = [...sites];
    const draggedItem = newSites[draggedIndex];
    newSites.splice(draggedIndex, 1);
    newSites.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    onReorder(newSites);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 px-4 max-w-[920px] py-6 mx-auto">
      {sites.map((site, index) => (
        <div 
          key={index} 
          className={`flex flex-col items-center group relative w-16 transition-all duration-300 ${isEditing ? 'animate-wiggle cursor-grab active:cursor-grabbing' : ''} ${draggedIndex === index ? 'opacity-30' : 'opacity-100'}`}
          style={isEditing ? { animationDelay: `${(index % 4) * 0.07}s`, animationDuration: `${0.24 + (index % 3) * 0.02}s` } : {}}
          draggable={isEditing}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`w-11 h-11 flex items-center justify-center bg-[#1a1a1f] rounded-full border border-white/5 transition-all duration-300 backdrop-blur-sm overflow-hidden ${isEditing ? 'border-white/10 shadow-lg shadow-black/40' : 'hover:bg-gray-800/40 hover:border-white/10'}`}
          >
            <div className={`w-full h-full flex items-center justify-center ${isEditing ? 'pointer-events-none' : ''}`}>
              <a
                href={isEditing ? undefined : site.url}
                className="w-full h-full flex items-center justify-center"
                onClick={(e) => isEditing && e.preventDefault()}
              >
                <img 
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(site.url).hostname}`} 
                  alt="" 
                  className={`w-5 h-5 object-contain opacity-80 transition-opacity ${!isEditing && 'group-hover:opacity-100'}`}
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
                  }}
                />
              </a>
            </div>
          </div>
          <span className="mt-3 text-[9px] text-gray-300 font-light tracking-wider opacity-90 transition-opacity uppercase truncate w-full text-center">
            {site.title}
          </span>
          {isEditing && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="absolute top-0 right-0 translate-x-[20%] -translate-y-[20%] text-red-500/80 hover:text-red-500 transition-all z-20 hover:scale-125 bg-[#0f0f12] rounded-full"
            >
              <MinusCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {sites.length < maxCount && !isEditing && (
        <button 
          onClick={onOpenModal}
          className="flex flex-col items-center group w-16"
        >
          <div className="w-11 h-11 flex items-center justify-center bg-gray-800/5 rounded-full border border-white/5 text-gray-500/60 group-hover:text-gray-400 group-hover:border-white/10 transition-all border-dashed">
            <Plus className="w-4 h-4" />
          </div>
          <span className="mt-3 text-[9px] text-gray-500/60 font-light tracking-wider uppercase opacity-80 group-hover:opacity-100">Add</span>
        </button>
      )}
    </div>
  );
};
