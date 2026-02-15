import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../lib/axios';
import { Search, AlertCircle, Loader2 } from 'lucide-react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  price_change_percentage_24h: number | null;
  total_volume: number | null;
  market_cap_rank: number | null;
}

const fetchMarketCoins = async (): Promise<Coin[]> => {
  try {
    console.log('Fetching market coins...');
    const response = await apiClient.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    
    console.log('Response received:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.error('Invalid response format, expected array, got:', typeof response.data);
      throw new Error('Invalid response format: expected array');
    }
    
    console.log('Coins fetched successfully, count:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market coins:', error);
    throw error;
  }
};

export const MarketPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['marketPageCoins'],
    queryFn: fetchMarketCoins,
    staleTime: 60000,
    retry: 2,
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const coinsList = Array.isArray(data) ? data : [];
  
  const filteredCoins = coinsList.filter((coin: Coin) => {
    try {
      return (
        (coin.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch {
      return false;
    }
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4 w-full">
        <AlertCircle size={48} className="text-red-400" />
        <div>
          <p className="text-lg font-semibold text-red-400 mb-2">Failed to load market data</p>
          <p className="text-sm text-slate-500 max-w-md">
            {error instanceof Error ? error.message : 'An unexpected error occurred while fetching market data'}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Overview</h1>
          <p className="text-slate-400 text-sm">Top 100 coins by market capitalization</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter coins..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading market data...</p>
          </div>
        </div>
      ) : filteredCoins && filteredCoins.length > 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm w-full">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full text-left border-collapse">
              <thead className="bg-slate-900/50 sticky top-0">
                <tr>
                  <th className="p-4 text-slate-400 font-medium text-sm">#</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Asset</th>
                  <th className="p-4 text-slate-400 font-medium text-sm text-right">Price</th>
                  <th className="p-4 text-slate-400 font-medium text-sm text-right">24h Change</th>
                  <th className="p-4 text-slate-400 font-medium text-sm text-right">Volume</th>
                  <th className="p-4 text-slate-400 font-medium text-sm text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm">
                {filteredCoins.map((coin: Coin) => (
                  <tr key={coin.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-500">{coin.market_cap_rank || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {coin.image && (
                          <img 
                            src={coin.image} 
                            alt={coin.name || 'coin'} 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {coin.name || '-'}
                          </span>
                          <span className="text-xs text-slate-500 uppercase font-medium">
                            {coin.symbol || '-'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right text-slate-200 font-medium">
                      ${coin.current_price ? coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
                    </td>
                    <td className={`p-4 text-right font-medium ${
                      coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
                        ? coin.price_change_percentage_24h >= 0 
                          ? 'text-emerald-400' 
                          : 'text-red-400'
                        : 'text-slate-400'
                    }`}>
                      {coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
                        ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                        : 'N/A'
                      }
                    </td>
                    <td className="p-4 text-right text-slate-400">
                      ${coin.total_volume ? `${(coin.total_volume / 1e6).toFixed(0)}M` : 'N/A'}
                    </td>
                    <td className="p-4 text-right text-slate-400">
                      ${coin.market_cap ? `${(coin.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px] text-center">
          <div>
            <p className="text-slate-400 text-lg mb-2">No coins found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search filters or wait for data to load</p>
          </div>
        </div>
      )}
    </div>
  );
};
