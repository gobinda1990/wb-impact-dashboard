// src/services/authService.js
import { authClient } from './apiClient';

// Save token & user info
export const setToken = token => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');

export const setUser = user => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

// Get all roles (array)
export const getUserRoles = () => getUser()?.roles || [];

// Return first role (for single-role use cases)
export const getUserRole = () => getUserRoles()[0] || null;

export const login = async (username, password, captchaInput, captcha) => {
  // ✅ Include CAPTCHA fields in the payload
  const res = await authClient.post('/auth/login', {username,password,captchaInput, captcha,});
  console.log('User:', getUser());
  console.log('Roles:', getUserRoles()); 
  if (res.data?.data) {
    const userData = res.data.data;
    // Save access token
    if (userData.accessToken) setToken(userData.accessToken);
    // Save full user info (roles, email, etc.)
    setUser(userData);

    return userData;
  }

  throw new Error('Invalid login response');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
