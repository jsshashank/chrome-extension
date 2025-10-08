import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

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
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f12] to-[#1a1a1f] flex items-center justify-center relative overflow-hidden">
      <div className="grain-overlay"></div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="mb-4 text-right">
          <div className="text-gray-400 text-sm font-light tracking-wide">
            {formatTime(currentTime)}
          </div>
          <div className="text-gray-500 text-xs font-light tracking-wide mt-1">
            {formatDate(currentTime)}
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#1a1a1f]/40 backdrop-blur-sm border border-gray-800/50 rounded-full pl-14 pr-6 py-5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-700/50 transition-all duration-300 font-light text-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
