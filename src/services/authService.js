import { authClient } from './apiClient';

// ---------- Token Management ----------
export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');
export const removeUser = () => localStorage.removeItem('user');

export const getUserRoles = () => getUser()?.roles || [];
export const getUserRole = () => getUserRoles()[0] || null;

// ---------- Login ----------
export const login = async (username, password, captchaInput, captcha) => {
  const res = await authClient.post('/login', { username, password, captchaInput, captcha });
  if (res.data?.data) {
    const { accessToken, ...userData } = res.data.data;
    if (accessToken) setToken(accessToken);
    setUser(userData);
    return userData;
  }
  throw new Error('Invalid login response');
};

// ---------- Refresh Token ----------
export const refreshAccessToken = async () => {
  try {
    const res = await authClient.post('/refresh-token');
    const { accessToken } = res.data?.data || {};
    if (accessToken) setToken(accessToken);
    return accessToken;
  } catch (err) {
    logout();
    throw err;
  }
};

// ---------- Logout ----------
export const logout = () => {
  removeToken();
  removeUser();
};
