import { dashboardClient } from './apiClient';

// ------------------------- USERS -------------------------

// Fetch all users
export const fetchUsers = async () => {
  try {
    const res = await dashboardClient.get('/users/user-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
};

// Fetch single user basic details by HRMS Code
export const fetchUserDetails = async (hrmsCode) => {
  try {
    const res = await dashboardClient.get(`/users/user-details/${hrmsCode}`);
    return res.data?.data || null;
  } catch (err) {
    console.error(`Error fetching user details for HRMS Code ${hrmsCode}:`, err);
    return null;
  }
};

// Fetch user's posting details
export const fetchUserPostingDetails = async (hrmsCode) => {
  try {
    const res = await dashboardClient.get(`/users/posting-details/${hrmsCode}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`Error fetching posting details for HRMS Code ${hrmsCode}:`, err);
    return [];
  }
};

// Fetch user's assigned projects
export const fetchUserProjectDetails = async (hrmsCode) => {
  try {
    const res = await dashboardClient.get(`/users/project-details/${hrmsCode}`);
    return res.data?.data || [];
  } catch (err) {
    console.error(`Error fetching project details for HRMS Code ${hrmsCode}:`, err);
    return [];
  }
};

// Fetch assigned users
export const fetchAssignedUsers = async () => {
  try {
    const res = await dashboardClient.get('/users/assigned');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching assigned users:', err);
    return [];
  }
};

export const fetchAllAssignedUsers = async () => {
  try {
    const res = await dashboardClient.get('/users/assigned-all');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching assigned users:', err);
    return [];
  }
};

// ------------------------- CURRENT USER -------------------------

// Fetch details of the currently logged-in user (for role-based access control)
export const fetchCurrentUser = async () => {
  try {
    const res = await dashboardClient.get('/users/current-user');
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
};


// ------------------------- CHARGES / CIRCLES / OFFICES -------------------------

export const fetchCharges = async () => {
  try {
    const res = await dashboardClient.get('/users/charge-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching charges:', err);
    return [];
  }
};

export const fetchCircles = async () => {
  try {
    const res = await dashboardClient.get('/users/circle-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching circles:', err);
    return [];
  }
};

export const fetchOffices = async () => {
  try {
    const res = await dashboardClient.get('/users/office-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching offices:', err);
    return [];
  }
};

// ------------------------- PROJECTS / ROLES -------------------------

export const fetchProjects = async () => {
  try {
    const res = await dashboardClient.get('/dashboard/project-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
};

export const fetchRoles = async () => {
  try {
    const res = await dashboardClient.get('/users/roles');    
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching roles:', err);
    return [];
  }
};

// ------------------------- ASSIGN / EDIT -------------------------

export const assignRolesAndProjects = async (assignData) => {
  try {
    const res = await dashboardClient.post('/users/assign', assignData);
    return res.data;
  } catch (err) {
    console.error('Error assigning roles/projects:', err);
    throw err;
  }
};

export const assignAddProjects = async (assignData) => {
  try {
    const res = await dashboardClient.post('/users/edit-projects', assignData);
    return res.data;
  } catch (err) {
    console.error('Error assigning additional projects:', err);
    throw err;
  }
};

export const releaseModule = async ({ hrmsCode, projectId, roleId }) => {
  try {
    const res = await dashboardClient.post('/users/releaseModule', { hrmsCode, projectId, roleId });
    return res.data; // returns backend JSON { success, message, ... }
  } catch (err) {
    console.error('Error releasing module:', err);
    throw err;
  }
};

// ------------------------- RELEASE POSTING -------------------------

export const releasePosting = async ({ hrmsCode, postingType, officeId }) => {
  try {
    const res = await dashboardClient.post('/users/releasePosting', {
      hrmsCode,
      postingType,
      officeId,
    });
    return res.data; // expects backend JSON like { success, message }
  } catch (err) {
    console.error('Error releasing posting:', err);
    throw err;
  }
};


// ------------------------- RELEASE EMPLOYEE -------------------------

export const doReleaseEmp = async (releaseData) => {
  try {
    const res = await dashboardClient.post('/users/release-employee', releaseData);
    return res.data;
  } catch (err) {
    console.error('Error releasing employee:', err);
    throw err;
  }
};

// ------------------------- IMAGE / ICON URLS -------------------------

export const profile_img_url = 'http://localhost:8082/api/uploads/profile-pics';
export const keyicon = '../images/keyic.png';  
export const defaultavatar = '../images/defaultavatar.png';
