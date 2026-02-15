import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Получение глобальных данных рынка
export const fetchGlobalData = async () => {
  const { data } = await axios.get(`${BASE_URL}/global`);
  return data.data;
};

// Получение истории цены для графика (по умолчанию bitcoin)
export const fetchCoinHistory = async (coinId: string = 'bitcoin', days: number = 7) => {
  const { data } = await axios.get(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  return data.prices;
};

// Получение списка топ-100 монет (для Маркета)
export const fetchMarketCoins = async () => {
  const { data } = await axios.get(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  );
  return data;
};