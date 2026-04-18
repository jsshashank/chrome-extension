import { useState, useEffect, useRef, useMemo } from 'react';

// Hooks
import { useClock } from './hooks/useClock';
import { useChromeData } from './hooks/useChromeData';
import { useTasks } from './hooks/useTasks';
import { useShortcuts } from './hooks/useShortcuts';
import { useNavigation } from './hooks/useNavigation';

// Components
import { TopNav } from './components/Dashboard/TopNav';
import { Clock } from './components/Dashboard/Clock';
import { SearchBar } from './components/Dashboard/SearchBar';
import { ShortcutGrid } from './components/Dashboard/ShortcutGrid';
import { BottomNav } from './components/Dashboard/BottomNav';
import { TaskSection } from './components/Tasks/TaskSection';
import { ActivityDrawer } from './components/Drawer/ActivityDrawer';
import { AddSiteModal } from './components/Modals/AddSiteModal';
import { SettingsOverlay, SettingsTab } from './components/Dashboard/SettingsOverlay';
import { DashboardFooter } from './components/Dashboard/DashboardFooter';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('about');
  const isScrolling = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Custom Hooks
  const { currentTime, formatTime, formatDate } = useClock();
  const { 
    topSites, 
    activeTabs, 
    recentHistory, 
    bookmarkBar, 
    setActiveTabs 
  } = useChromeData(isDrawerOpen);
  
  const {
    taskInput,
    setTaskInput,
    addTask,
    toggleTask,
    deleteTask,
    sortedTasks
  } = useTasks();

  const {
    customSites,
    setCustomSites,
    savedForLater,
    addCustomSite,
    removeCustomSite,
    removeSaved
  } = useShortcuts();

  const { navigateTo, closeTab } = useNavigation();

  // Handle click outside to save
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isEditing && gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  // Scroll logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isModalOpen || isEditing || isSettingsOpen || isScrolling.current) return;

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

  // Global Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsModalOpen(false);
        setIsEditing(false);
        setIsSettingsOpen(false);
        return;
      }
      
      if (e.key.toLowerCase() === 'q' && !isModalOpen && !isSettingsOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIsDrawerOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isSettingsOpen]);

  // Clean up edit mode when leaving home section
  useEffect(() => {
    if (activeSection !== 0) {
      setIsEditing(false);
      setIsSettingsOpen(false);
    }
  }, [activeSection]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      navigateTo(url);
    }
  };

  const allSites = useMemo(() => customSites.slice(0, 20), [customSites]);

  const tabsByDomain = useMemo(() => activeTabs.reduce((acc, tab) => {
    if (!acc[tab.domain]) acc[tab.domain] = [];
    acc[tab.domain].push(tab);
    return acc;
  }, {} as Record<string, typeof activeTabs>), [activeTabs]);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f0f12] relative">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0"></div>
      
      <div 
        className="w-full h-full transition-transform duration-[700ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
        style={{ transform: `translateY(-${activeSection * 100}%)` }}
      >
        {/* DASHBOARD SECTION */}
        <section className="h-full w-full relative flex flex-col items-center justify-between py-8 px-6 overflow-hidden">
          <TopNav 
            bookmarkBar={bookmarkBar} 
            navigateTo={navigateTo} 
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing(!isEditing)}
          />

          <div className="w-full max-w-4xl flex flex-col items-center z-10 flex-grow justify-center -mt-12">
            <Clock time={formatTime(currentTime)} date={formatDate(currentTime)} />
            <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={handleSearch} />
            <div ref={gridRef} className="w-full flex justify-center">
              <ShortcutGrid 
                sites={allSites} 
                onRemove={removeCustomSite} 
                onOpenModal={() => setIsModalOpen(true)} 
                maxCount={20}
                isEditing={isEditing}
                onReorder={setCustomSites}
              />
            </div>
          </div>

          <BottomNav 
            onOpenDrawer={() => setIsDrawerOpen(true)} 
            navigateTo={navigateTo} 
            onOpenTab={(tab) => {
              setActiveSettingsTab(tab);
              setIsSettingsOpen(true);
            }} 
          />
        </section>

        {/* TASKS SECTION */}
        <TaskSection 
          taskInput={taskInput}
          setTaskInput={setTaskInput}
          addTask={addTask}
          sortedTasks={sortedTasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          onGoHome={() => setActiveSection(0)}
        />
      </div>

      <ActivityDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTabs={activeTabs}
        recentHistory={recentHistory}
        savedForLater={savedForLater}
        tabsByDomain={tabsByDomain}
        navigateTo={navigateTo}
        closeTab={(id) => closeTab(id, activeTabs, setActiveTabs)}
        removeSaved={removeSaved}
      />

      <AddSiteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addCustomSite} 
      />

      <SettingsOverlay 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        activeTab={activeSettingsTab} 
        setActiveTab={setActiveSettingsTab} 
      />
    </div>
  );
}

export default App;
