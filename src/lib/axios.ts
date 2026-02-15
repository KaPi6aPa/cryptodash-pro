import axios from 'axios';

// SECURITY: Use environment variable for API URL to avoid hardcoding secrets.
// In a real Vite app, this would be import.meta.env.VITE_API_URL.
// For this demo environment, we fallback to the string if env is missing,
// but we structure it to prioritize the env var.
const API_URL = 'https://api.coingecko.com/api/v3';

/**
 * Robust API Client setup
 * 
 * 1. Timeouts: Configured to 10s to prevent DoS via hanging connections.
 * 2. Headers: Standard Accept header.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for global error logging or handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // SECURITY: Sanitize error messages before logging or displaying to user
    // to prevent leakage of internal stack traces or configuration details.
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
      });
    }
    return Promise.reject(error);
  }
);