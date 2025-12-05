import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserRoles } from './services/authService';

const PrivateRoute = ({ children, roles = [] }) => {
  const token = getToken();
  let userRoles = getUserRoles(); // e.g. ["Super Admin", "Circle Approver"]

  // 🔒 1. If user is not authenticated → redirect to login
  if (!token) {
    console.warn('No token found. Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Normalize roles: trim spaces and lowercase for comparison
  userRoles = userRoles.map(r => r.trim().toLowerCase());
  const normalizedRoles = roles.map(r => r.trim().toLowerCase());

  // 👮 2. If route requires specific roles → check intersection
  if (roles.length > 0) {
    // Roles that bypass restrictions
    const bypassRoles = ['super admin', 'circle approver', 'charge approver'];

    const hasBypassRole = userRoles.some(role => bypassRoles.includes(role));
    const hasAccess = hasBypassRole || userRoles.some(role => normalizedRoles.includes(role));

    if (!hasAccess) {
      console.warn('User lacks permission. Redirecting to /unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ 3. Authorized → render requested component
  return children;
};

export default PrivateRoute;
