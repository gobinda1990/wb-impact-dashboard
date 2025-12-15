import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserRoles } from './services/authService';

const PrivateRoute = ({ children, roles = [] }) => {
  const token = getToken();
  const userRoles = getUserRoles(); // ✅ Array of roles from login (e.g. ["Admin", "Admin_Circle", "Custodian"])
  // alert(userRoles);

  // 🔒 1. If user is not authenticated → redirect to login
  if (!token) {
    console.warn('No token found. Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // 👮 2. If route requires specific roles → check intersection
  if (roles.length > 0) {
    const hasAccess = userRoles.some(role => roles.includes(role));
    

    if (!hasAccess) {
      console.warn('User lacks permission. Redirecting to /unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ 3. Authorized → render requested component
  return children;
};

export default PrivateRoute;
