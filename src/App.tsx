import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Clock, Bookmark, Settings, ExternalLink, CheckCircle2, Download, ChevronUp, X, Trash2, Plus, Zap, AppWindow as TabIcon, History, BookmarkIcon, XCircle } from 'lucide-react';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTabs, setActiveTabs] = useState<{ id: number; title: string; url: string; domain: string }[]>([]);
  const [recentHistory, setRecentHistory] = useState<{ title: string; url: string; time: number }[]>([]);
  const [bookmarkBar, setBookmarkBar] = useState<{ title: string; url: string }[]>([]);
  const [savedForLater, setSavedForLater] = useState<{ title: string; url: string }[]>(() => {
    try {
      const saved = localStorage.getItem('savedForLater');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const isScrolling = useRef(false);

  useEffect(() => {
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    if (isDrawerOpen && typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({}, (tabs) => {
        // Filter out current tab and system pages/extensions
        const currentTabUrl = window.location.href;
        const processedTabs = tabs
          .filter(t => 
            t.url !== currentTabUrl && 
            !t.url?.startsWith('chrome://') && 
            !t.url?.startsWith('chrome-extension://')
          )
          .map(t => ({
            id: t.id || 0,
            title: t.title || 'Untitled',
            url: t.url || '',
            domain: t.url ? new URL(t.url).hostname.replace('www.', '') : 'unknown'
          }));
        setActiveTabs(processedTabs);
      });

      chrome.history.search({ text: '', maxResults: 20 }, (items) => {
        setRecentHistory(items.map(i => ({
          title: i.title || 'Untitled',
          url: i.url || '',
          time: i.lastVisitTime || 0
        })));
      });
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.getTree((tree) => {
        // Chrome tree: tree[0] is root, root.children[0] is Bookmarks Bar
        const root = tree[0];
        if (root && root.children) {
          // Bookmarks Bar is always the first child of the root
          const bar = root.children[0];
          if (bar && bar.children) {
            const links = bar.children
              .filter((child: chrome.bookmarks.BookmarkTreeNode) => child.url)
              .map((child: chrome.bookmarks.BookmarkTreeNode) => ({ title: child.title, url: child.url! }))
              .slice(0, 12);
            setBookmarkBar(links);
          }
        }
      });
    }
  }, []);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with 'q', but not if typing in an input
      if (e.key.toLowerCase() === 'q' && !isModalOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIsDrawerOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);


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

  const navigateTo = (url: string, e?: React.MouseEvent) => {
    try {
      const isAltPressed = e?.altKey;

      if (typeof chrome !== 'undefined' && (chrome.tabs || chrome.windows)) {
        if (isAltPressed) {
          chrome.windows.create({ url, type: 'popup', width: 800, height: 600 });
        } else if (url.startsWith('chrome://')) {
          chrome.tabs.create({ url });
        } else {
          chrome.tabs.update({ url });
        }
      } else {
        window.open(url, isAltPressed ? '_blank' : '_self');
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

  const saveForLater = (title: string, url: string) => {
    if (!savedForLater.find(s => s.url === url)) {
      setSavedForLater([{ title, url }, ...savedForLater]);
    }
  };

  const removeSaved = (url: string) => {
    setSavedForLater(savedForLater.filter(s => s.url !== url));
  };

  const closeTab = (id: number) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.remove(id, () => {
        setActiveTabs(activeTabs.filter(t => t.id !== id));
      });
    }
  };

  const tabsByDomain = activeTabs.reduce((acc, tab) => {
    if (!acc[tab.domain]) acc[tab.domain] = [];
    acc[tab.domain].push(tab);
    return acc;
  }, {} as Record<string, typeof activeTabs>);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f0f12] relative">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0"></div>
      
      <div 
        className="w-full h-full transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
        style={{ transform: `translateY(-${activeSection * 100}%)` }}
      >
        {/* DASHBOARD SECTION */}
        <section className="h-full w-full relative flex flex-col items-center justify-between py-8 px-6 overflow-hidden">
        <div className="w-full max-w-[98%] flex justify-between items-start z-10 shrink-0">
          <div className="flex items-center space-x-6 pt-2 overflow-x-auto no-scrollbar max-w-[70%]">
            {bookmarkBar.map((bm, i) => (
              <button 
                key={i} 
                onClick={(e) => navigateTo(bm.url, e)} 
                className="text-gray-500 hover:text-gray-200 transition-all whitespace-nowrap"
              >
                <span className="text-[9px] font-light tracking-widest uppercase">{bm.title}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-6 pt-2">
            <button onClick={() => setIsDrawerOpen(true)} className="p-1 px-2 mb-1 bg-gray-800/20 rounded-md text-gray-500 hover:text-gray-200 transition-all border border-transparent hover:border-gray-800/40">
              <Zap className="w-3.5 h-3.5" />
            </button>
            <button onClick={(e) => navigateTo('https://mail.google.com', e)} className="text-gray-400 hover:text-gray-200 text-[10px] font-light tracking-widest uppercase transition-colors">Gmail</button>
            <button onClick={(e) => navigateTo('https://www.google.com/imghp', e)} className="text-gray-400 hover:text-gray-200 text-[10px] font-light tracking-widest uppercase transition-colors">Images</button>
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
          <button onClick={(e) => navigateTo('chrome://history', e)} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Clock className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">History</span>
          </button>
          <button onClick={(e) => navigateTo('chrome://bookmarks', e)} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Bookmark className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Bookmarks</span>
          </button>
          <button onClick={(e) => navigateTo('chrome://downloads', e)} className="flex flex-col items-center space-y-1 group">
            <div className="p-2.5 bg-gray-800/20 rounded-full group-hover:bg-gray-800/40 transition-all text-gray-400 group-hover:text-gray-200"><Download className="w-4 h-4" /></div>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Downloads</span>
          </button>
          <button onClick={(e) => navigateTo('chrome://settings', e)} className="flex flex-col items-center space-y-1 group">
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-md transition-all" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-[#121214]/95 backdrop-blur-2xl border border-gray-800/30 p-8 rounded-[1.5rem] w-full max-w-[480px] relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-100 text-[10px] font-light tracking-[0.5em] uppercase">New Portal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-100 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <form onSubmit={addCustomSite} className="space-y-5">
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
      )}

      {/* ACTIVITY DRAWER */}
      <div 
        className={`fixed inset-0 z-[120] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${isDrawerOpen ? 'visible' : 'invisible pointer-events-none'}`}
      >
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>
        <div 
          className={`absolute bottom-0 left-0 w-full h-[75vh] bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-gray-800/40 shadow-[0_-20px_100px_rgba(0,0,0,0.8)] transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] p-12 py-10 flex flex-col ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
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
    </div>
  );
}

export default App;
