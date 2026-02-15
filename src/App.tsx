import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ИСПРАВЛЕНО: Layout лежит прямо в components
import { Layout } from './components/Layout'; 

import { DashboardPage } from './pages/DashboardPage';
import { MarketPage } from './pages/MarketPage';
import PortfolioPage from './pages/PortfolioPage';
import NewsPage from './pages/NewsPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<div className="p-10 text-white">Page Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;