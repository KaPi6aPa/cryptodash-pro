import { z } from 'zod';

/**
 * DATA INTEGRITY SCHEMA
 * 
 * We strictly define the shape of the data we expect from the external API.
 * This acts as a firewall against malformed data that could crash the UI.
 * 
 * - id: Unique identifier
 * - symbol: Ticker symbol
 * - name: Full name
 * - image: URL to the logo (must be a valid URL)
 * - current_price: Number required
 * - price_change_percentage_24h: Can be null for new tokens, so we handle nullable
 * - market_cap: Number required
 */
export const CryptoCurrencySchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().url(),
  current_price: z.number(),
  price_change_percentage_24h: z.number().nullable(), 
  market_cap: z.number(),
});

// Type inference for TypeScript usage
export type CryptoCurrency = z.infer<typeof CryptoCurrencySchema>;

// Schema for the array response
export const CryptoListSchema = z.array(CryptoCurrencySchema);

/**
 * MARKET CHART SCHEMA
 * Response format: { prices: [ [timestamp, price], ... ] }
 */
export const MarketChartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
  market_caps: z.array(z.tuple([z.number(), z.number()])).optional(),
  total_volumes: z.array(z.tuple([z.number(), z.number()])).optional(),
});

export type MarketChartData = z.infer<typeof MarketChartSchema>;

/**
 * GLOBAL MARKET DATA SCHEMA
 */
export const GlobalDataSchema = z.object({
  data: z.object({
    active_cryptocurrencies: z.number(),
    markets: z.number(),
    total_market_cap: z.record(z.string(), z.number()), // Key is currency code (e.g., "usd")
    total_volume: z.record(z.string(), z.number()),
    market_cap_percentage: z.record(z.string(), z.number()), // BTC dominance, etc.
    market_cap_change_percentage_24h_usd: z.number(),
  })
});

export type GlobalData = z.infer<typeof GlobalDataSchema>;