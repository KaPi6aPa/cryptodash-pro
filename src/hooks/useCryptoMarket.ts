import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios';
import { CryptoListSchema, type CryptoCurrency } from '../schemas/crypto';
import { ZodError } from 'zod';

// Fetcher function separated for testability
const fetchCryptoMarkets = async (): Promise<CryptoCurrency[]> => {
  // SECURITY: Public endpoint usage. 
  // We use specific params to limit payload size (performance/DoS mitigation).
  const { data } = await apiClient.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50, // Limit to top 50 to ensure performant rendering
      page: 1,
      sparkline: false,
    },
  });

  // DATA INTEGRITY: Runtime Validation
  // Parse data through Zod. If the API changes its schema or returns garbage,
  // this will throw a ZodError, which is caught by React Query.
  // This prevents the "undefined is not a function" crashes in the UI layer.
  try {
    return CryptoListSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Data Validation Failed:", error.issues);
      throw new Error("Received malformed data from upstream provider.");
    }
    throw error;
  }
};

export const useCryptoMarket = () => {
  return useQuery<CryptoCurrency[], Error>({
    queryKey: ['cryptoMarkets'],
    queryFn: fetchCryptoMarkets,
    // CACHING STRATEGY
    // Cache data for 1 minute to avoid hitting CoinGecko's rate limits (approx 10-30 req/min).
    staleTime: 60 * 1000, 
    refetchOnWindowFocus: false,
    retry: 2,
  });
};