import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PieChart, Newspaper, Settings, Hexagon } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export const Sidebar: React.FC = () => {
  const { name, email } = useUserStore();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Market', path: '/market' },
    { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 h-screen fixed left-0 top-0 z-10">
      <div className="flex items-center h-16 px-6 border-b border-slate-700">
        <div className="flex items-center gap-3 text-cyan-400">
            <Hexagon className="w-8 h-8 fill-cyan-400/20" />
            <span className="text-xl font-bold text-slate-100 tracking-tight">CryptoDash</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20"></div>
             <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">{name}</p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
             </div>
        </div>
      </div>
    </aside>
  );
};