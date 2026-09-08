import axios from 'axios';

/**
 * Central API client.
 * All network requests should go through this instance.
 * In production set VITE_API_URL in your environment.
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: attach auth token when available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token'); // never store passwords
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Never expose raw backend errors to the UI
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);
