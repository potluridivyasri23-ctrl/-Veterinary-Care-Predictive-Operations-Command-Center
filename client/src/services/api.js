import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '/api';
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}
if (!baseURL.endsWith('/api') && !baseURL.startsWith('/api')) {
  baseURL += '/api';
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vet_ops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
