import axios from 'axios';
import { getToken, setToken, logout } from './authService';

export const authClient = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
});

export const dashboardClient = axios.create({
  baseURL: '/api/dashboard',
  withCredentials: true,
});

// export const authClient = axios.create({
//   baseURL: 'http://10.153.45.169:8081/api/auth',
//   withCredentials: true,
// });

// export const dashboardClient = axios.create({
//   baseURL: 'http://10.153.45.169:8082/api/dashboard',
//   withCredentials: true,
// });

dashboardClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

dashboardClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Only handle 401s once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await authClient.post('/refresh-token');
        const userData = refreshRes?.data?.data; // ✅ safe optional chaining

        if (userData && userData.accessToken) {
          const newToken = userData.accessToken;
          setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return dashboardClient(originalRequest); // retry original request
        } else {
          //  no valid token returned
          console.error('Refresh token response missing data or accessToken:', refreshRes);
          logout();
          window.location.href = '/login';
          return Promise.reject(new Error('No access token returned from refresh'));
        }
      } catch (err) {
        logout();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

