import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Clock, Bookmark, Settings, ExternalLink, CheckCircle2, Grid, Download, ChevronUp, X, Trash2, Plus } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [topSites, setTopSites] = useState<{ title: string; url: string }[]>([]);
  const [customSites, setCustomSites] = useState<{ title: string; url: string }[]>(() => {
    try {
      const saved = localStorage.getItem('customSites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse customSites', e);
      return [];
    }
  });
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse tasks', e);
      return [];
    }
  });
  const [taskInput, setTaskInput] = useState('');
  const [goal, setGoal] = useState(() => localStorage.getItem('dailyGoal') || '');
  const [isCompleted, setIsCompleted] = useState(() => localStorage.getItem('goalCompleted') === 'true');
  const [newItem, setNewItem] = useState({ title: '', url: '' });
  const [activeSection, setActiveSection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isScrolling = useRef(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('customSites', JSON.stringify(customSites));
    localStorage.setItem('goalCompleted', String(isCompleted));
    localStorage.setItem('dailyGoal', goal);
  }, [tasks, customSites, isCompleted, goal]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isModalOpen || isScrolling.current) return;

      if (e.deltaY > 50 && activeSection === 0) {
        isScrolling.current = true;
        setActiveSection(1);
        setTimeout(() => isScrolling.current = false, 800);
      } else if (e.deltaY < -50 && activeSection === 1) {
        isScrolling.current = true;
        setActiveSection(0);
        setTimeout(() => isScrolling.current = false, 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection, isModalOpen]);


  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.topSites) {
      chrome.topSites.get((sites) => {
        setTopSites(sites.slice(0, 10));
      });
    } else {
      setTopSites([
        { title: 'Google', url: 'https://google.com' },
        { title: 'YouTube', url: 'https://youtube.com' },
        { title: 'GitHub', url: 'https://github.com' },
        { title: 'Gmail', url: 'https://mail.google.com' },
        { title: 'Reddit', url: 'https://reddit.com' },
        { title: 'Twitter', url: 'https://twitter.com' }
      ]);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.update({ url });
      } else {
        window.open(url, '_self');
      }
    }
  };

  const navigateTo = (url: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        // Use create for internal pages to avoid "Not allowed to load local resource"
        if (url.startsWith('chrome://')) {
          chrome.tabs.create({ url });
        } else {
          chrome.tabs.update({ url });
        }
      } else {
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error('Navigation failed', e);
      window.open(url, '_blank');
    }
  };

  const addCustomSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.title && newItem.url) {
      let url = newItem.url;
      if (!url.startsWith('http')) url = 'https://' + url;
      setCustomSites([...customSites, { title: newItem.title, url }]);
      setNewItem({ title: '', url: '' });
      setIsModalOpen(false);
    }
  };

  const removeCustomSite = (index: number) => {
    setCustomSites(customSites.filter((_, i) => i !== index));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      setTasks([{ id: Date.now().toString(), text: taskInput.trim(), completed: false }, ...tasks]);
      setTaskInput('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

  const allSites = [...customSites, ...topSites].slice(0, 10);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f0f12] relative">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0"></div>
      
      <div 
        className="w-full h-full transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
        style={{ transform: `translateY(-${activeSection * 100}%)` }}
      >
        {/* DASHBOARD SECTION */}
        <section className="h-full w-full relative flex flex-col items-center justify-between py-8 px-6 overflow-hidden">
        <div className="w-full max-w-5xl flex justify-end items-start z-10 shrink-0">
          <div className="flex items-center space-x-6 pt-2">
            <button onClick={() => navigateTo('https://mail.google.com')} className="text-gray-400 hover:text-gray-200 text-[10px] font-light tracking-widest uppercase transition-colors">Gmail</button>
            <button onClick={() => navigateTo('https://www.google.com/imghp')} className="text-gray-400 hover:text-gray-200 text-[10px] font-light tracking-widest uppercase transition-colors">Images</button>
          </div>
        </div>

        <div className="w-full max-w-3xl flex flex-col items-center z-10 flex-grow justify-center -mt-12">
          <div className="mb-12 text-center select-none">
            <div className="text-gray-100 text-8xl font-extralight tracking-widest mb-4">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-400 text-[10px] font-light tracking-[0.6em] uppercase opacity-80 uppercase">
              {formatDate(currentTime)}
            </div>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-xl relative mb-12">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find something..."
                className="w-full bg-[#1a1a1f]/60 border border-gray-800/40 rounded-full pl-14 pr-6 py-4 text-gray-200 placeholder-gray-700 focus:outline-none focus:border-gray-700/50 transition-all duration-300 font-light text-base"
              />
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-6 px-4 max-w-2xl">
            {allSites.map((site, index) => (
              <div key={index} className="flex flex-col items-center group relative w-16">
                <a
                  href={site.url}
                  className="w-10 h-10 flex items-center justify-center bg-[#1a1a1f] rounded-xl border border-gray-800/40 hover:bg-gray-800/40 hover:border-gray-700/60 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                >
                  <img 
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(site.url).hostname}`} 
                    alt="" 
                    className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
                    }}
                  />
                </a>
                <span className="mt-2 text-[9px] text-gray-300 font-light tracking-wider opacity-90 group-hover:opacity-100 transition-opacity uppercase truncate w-full text-center">
                  {site.title}
                </span>
                {index < customSites.length && (
                  <button 
                    onClick={() => removeCustomSite(index)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/40 hover:text-red-400"
                  >
                    <X className="w-2 h-2" />
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center group w-16"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-gray-800/5 rounded-xl border border-gray-800/10 text-gray-800 group-hover:text-gray-500 group-hover:border-gray-700/30 transition-all border-dashed">
                <Plus className="w-4 h-4" />
              </div>
              <span className="mt-2 text-[9px] text-gray-800 font-light tracking-wider uppercase opacity-60">Add</span>
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-center space-x-12 z-10 shrink-0 pb-4">
          <button onClick={() => navigateTo('chrome://history')} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Clock className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">History</span>
          </button>
          <button onClick={() => navigateTo('chrome://bookmarks')} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Bookmark className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Bookmarks</span>
          </button>
          <button onClick={() => navigateTo('chrome://downloads')} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Download className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Downloads</span>
          </button>
          <button onClick={() => navigateTo('chrome://settings')} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Settings className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Settings</span>
          </button>
        </div>
      </section>

      {/* TASKS SECTION */}
      <section className="h-screen w-full relative flex flex-col items-center justify-center px-6 bg-black/5">
        <div className="w-full max-w-lg">
          <h2 className="text-gray-100 text-sm font-light tracking-[0.5em] uppercase mb-12 text-center">Tasks</h2>
          
          <form onSubmit={addTask} className="mb-10">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-transparent border-b border-gray-800/30 py-3 text-center text-xl font-extralight text-gray-200 focus:outline-none focus:border-gray-700/40 transition-all placeholder-gray-800"
            />
          </form>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar" onWheel={(e) => e.stopPropagation()}>
            {sortedTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between group py-2">
                <div className="flex items-center space-x-4 flex-1">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`transition-colors ${task.completed ? 'text-emerald-500/40' : 'text-gray-700 hover:text-gray-400'}`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <span className={`text-base font-light transition-all ${task.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                    {task.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-700 hover:text-red-900/60 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-24 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity animate-pulse cursor-pointer">
            <button onClick={() => setActiveSection(0)} className="group flex flex-col items-center">
              <ChevronUp className="w-5 h-5 text-gray-100 group-hover:text-white transition-colors mb-1" />
              <span className="text-[8px] uppercase tracking-[0.4em] text-gray-100 font-light group-hover:text-white transition-colors">Home</span>
            </button>
          </div>
        </div>
      </section>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-[#121214] border border-gray-800/50 p-8 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl">
            <h3 className="text-gray-100 text-sm font-light tracking-widest uppercase mb-8 text-center">New Shortcut</h3>
            <form onSubmit={addCustomSite} className="space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] text-gray-600 uppercase tracking-widest ml-1 mb-1">Name</div>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800/60 p-4 rounded-2xl text-gray-300 focus:outline-none focus:border-gray-700 transition-colors"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-gray-600 uppercase tracking-widest ml-1 mb-1">URL</div>
                <input
                  type="text"
                  value={newItem.url}
                  onChange={e => setNewItem({...newItem, url: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800/60 p-4 rounded-2xl text-gray-300 focus:outline-none focus:border-gray-700 transition-colors"
                />
              </div>
              <div className="flex pt-4 space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 hover:text-gray-300 text-[10px] font-light uppercase tracking-widest transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-gray-800/30 hover:bg-gray-800/50 text-gray-200 rounded-2xl text-[10px] font-light uppercase tracking-widest transition-all border border-gray-700/20">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
