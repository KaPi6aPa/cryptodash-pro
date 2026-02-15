import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PortfolioChart } from '../components/dashboard/PortfolioChart';
import { DashboardTable } from '../components/DashboardTable';
import { Globe, BarChart3, Bitcoin } from 'lucide-react';

const fetchGlobalData = async () => {
  const { data } = await axios.get('https://api.coingecko.com/api/v3/global');
  return data.data;
};

const fetchBitcoinHistory = async () => {
  const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
  return data.prices; 
};

export const DashboardPage = () => {
  const { data: globalData } = useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: 60000, 
  });

  const { data: chartData } = useQuery({
    queryKey: ['bitcoinHistory'],
    queryFn: fetchBitcoinHistory,
    refetchInterval: 60000,
  });

  const formatCurrency = (value: number) => {
    if (!value) return '$0.00';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400">Your daily crypto analytics snapshot.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 font-medium">Global Cap</span>
            <div className="p-2 bg-slate-700/50 rounded-lg text-blue-400"><Globe size={20} /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {globalData ? formatCurrency(globalData.total_market_cap.usd) : '...'}
          </h3>
        </div>

        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 font-medium">24h Volume</span>
            <div className="p-2 bg-slate-700/50 rounded-lg text-purple-400"><BarChart3 size={20} /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {globalData ? formatCurrency(globalData.total_volume.usd) : '...'}
          </h3>
        </div>

        <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 font-medium">BTC Dominance</span>
            <div className="p-2 bg-slate-700/50 rounded-lg text-orange-400"><Bitcoin size={20} /></div>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {globalData ? `${globalData.market_cap_percentage.btc.toFixed(1)}%` : '...'}
          </h3>
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="w-full">
        <PortfolioChart data={chartData} />
      </div>
      
      <div className="w-full">
        <DashboardTable />
      </div>
    </div>
  );
};