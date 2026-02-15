import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const DashboardTable = () => {
  // 1. Запрашиваем Топ-5 монет для быстрого обзора
  const { data: coins, isLoading } = useQuery({
    queryKey: ['dashboardTopCoins'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false'
      );
      return data;
    },
    refetchInterval: 60000, // Обновляем раз в минуту
  });

  return (
    <div className="mt-6 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">Top Performing Assets</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Asset</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Change (24h)</th>
              <th className="px-6 py-3 text-right hidden sm:table-cell">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm">
            {isLoading ? (
              // Заглушка загрузки
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Loading market data...
                </td>
              </tr>
            ) : (
              coins?.map((coin: any) => (
                <tr key={coin.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <div>
                        <span className="font-medium text-white">{coin.name}</span>
                        <span className="text-slate-500 text-xs ml-2 uppercase">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium">
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${
                    coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {coin.price_change_percentage_24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 hidden sm:table-cell">
                    ${(coin.market_cap / 1e9).toFixed(2)}B
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};