import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

interface Notification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'Bitcoin is up 5% in the last hour', time: '2 min ago', unread: true },
  { id: 2, text: 'New login detected from Chrome on Windows', time: '18 min ago', unread: true },
  { id: 3, text: 'Your portfolio crossed the $50k milestone', time: '1 hr ago', unread: false },
];

export const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const hasUnread = notifications.some((n) => n.unread);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      e.preventDefault();
      navigate(`/market?search=${encodeURIComponent(searchValue)}`);
      setSearchValue(''); 
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Search Input */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full text-slate-400 focus-within:text-white transition-colors">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          <input 
            type="text" 
            placeholder="Global search (Press Enter)..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification Bell + Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900" />
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-700/50 bg-slate-800/70 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {hasUnread && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Items */}
              <ul className="max-h-72 overflow-y-auto divide-y divide-slate-700/40">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 transition-colors hover:bg-slate-700/30 ${
                      n.unread ? 'bg-slate-700/20' : ''
                    }`}
                  >
                    {/* Unread dot */}
                    <span className="mt-1.5 shrink-0">
                      <span
                        className={`block h-2 w-2 rounded-full ${
                          n.unread ? 'bg-cyan-400' : 'bg-transparent'
                        }`}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-200 leading-snug">{n.text}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right">
            <p className="text-xs text-slate-400">Status</p>
            <p className="text-sm font-medium text-emerald-400">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};