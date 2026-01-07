import { dashboardClient } from './apiClient';

// Fetch project details from backend
export const fetchProjects = async () => {
  const res = await dashboardClient.get('/dashboard/project-details');
  // The backend wraps the actual list in "data"
  return res.data?.data || [];
};

export const fetchUsers = async () => {
  const res = await dashboardClient.get('/dashboard/user-details');
 return res.data?.data || [];
};

export const fetchReports = async () => {
  try {
    const res = await dashboardClient.get('/dashboard/reports');

    // Return the object exactly { assignedCount, commonPoolCount }
    return res.data?.data || { assignedCount: 0, commonPoolCount: 0 };

  } catch (error) {
    console.error("Error loading dashboard reports:", error);
    return { assignedCount: 0, commonPoolCount: 0 }; 
  }
};

export const assignRolesAndProjects = async (assignData) => {
  const res = await dashboardClient.post('/users/assign', assignData);
  return res.data;
};

export const fetchCustodianAssets = async () => {
  const res = await dashboardClient.get('/dashboard/custodian/assets');
  return res.data?.data || [];
};

export const getUserProfile = async () => {
  const res = await dashboardClient.get('/dashboard/profile');
  console.log("profile data >>>"+JSON.stringify(res.data?.data));
  return res.data?.data;
};

// Update profile fields
export const updateUserProfile = async (profileData) => {
  const res = await dashboardClient.put('/dashboard/profile', profileData);
  return res.data;
};

// Upload profile picture
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await dashboardClient.post('/dashboard/profile/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data; // returns uploaded file URL
};

// Get stored roles (for sidebar etc.)
export const getUserRoles = () => {
  try {
    const data = JSON.parse(localStorage.getItem('user'));
    return data?.roles || [];
  } catch {
    return [];
  }
};

export const addModule = async (moduleData) => {
  const res = await dashboardClient.post("/dashboard/add-module", moduleData);
  return res.data?.data;
};