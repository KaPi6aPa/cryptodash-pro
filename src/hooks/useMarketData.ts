import { useQuery } from '@tanstack/react-query';
import { fetchCoinHistory, fetchGlobalData } from '../api/crypto';

export const useCoinHistory = (coinId: string) => {
  return useQuery({
    queryKey: ['coinHistory', coinId],
    queryFn: () => fetchCoinHistory(coinId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useGlobalMarket = () => {
  return useQuery({
    queryKey: ['globalMarket'],
    queryFn: fetchGlobalData,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};