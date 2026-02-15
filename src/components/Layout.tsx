import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 hidden md:block border-r border-slate-800">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-slate-900">
          {/* Контейнер на всю ширину с отступами */}
          <div className="w-full min-h-full p-4 md:p-6">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};