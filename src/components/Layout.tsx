import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, PieChart, Newspaper } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const mobileNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/market', icon: LineChart, label: 'Market' },
  { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { to: '/news', icon: Newspaper, label: 'News' },
] as const;

export const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar — desktop only */}
      <div className="w-64 flex-shrink-0 hidden md:block border-r border-slate-800">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto bg-slate-900">
          <div className="w-full min-h-full p-4 md:p-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 w-full h-16 z-50 flex items-center justify-around
                   border-t border-slate-800 bg-slate-900/80 backdrop-blur-lg md:hidden"
      >
        {mobileNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex flex-col items-center gap-0.5"
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  className={isActive ? 'text-emerald-500' : 'text-slate-400'}
                />
                <span
                  className={`text-[10px] ${
                    isActive ? 'text-emerald-500 font-medium' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};