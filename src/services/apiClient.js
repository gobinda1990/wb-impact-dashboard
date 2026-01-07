import axios from 'axios';
import { getToken, setToken, logout } from './authService';

export const authClient = axios.create({
  baseURL: 'http://10.153.45.169:8081/api',
  withCredentials: true,
});

export const dashboardClient = axios.create({
  baseURL: 'http://10.153.45.169:8082/api',
  withCredentials: true,
});

dashboardClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

dashboardClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await authClient.post('/auth/refresh-token');
        const newToken = refreshRes.data.accessToken;
        setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return dashboardClient(originalRequest);
      } catch (err) {
        logout();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
