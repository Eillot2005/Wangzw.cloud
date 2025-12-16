import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
if (apiUrl && !apiUrl.startsWith('http')) {
  apiUrl = `https://${apiUrl}`;
}

const API_BASE_URL = apiUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(`[API] Request to ${config.url}, token exists: ${!!token}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from ${response.config.url}: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`[API] Error response:`, {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response?.status === 401) {
      console.error('[API] 401 Unauthorized - logging out');
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
