import { dashboardClient } from './apiClient';

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

// Fetch all charges
export const fetchCharges = async () => {
  try {
    const response = await dashboardClient.get('/users/charge-details');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching charges:', error);
    return [];
  }
};

// Fetch all circles
export const fetchCircles = async () => {
  try {
    const response = await dashboardClient.get('/users/circle-details');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching circles:', error);
    return [];
  }
};

// Fetch all offices (postings)
export const fetchOffices = async () => {
  try {
    const response = await dashboardClient.get('/users/office-details');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching offices:', error);
    return [];
  }
};

export const fetchRoles = async () => {
  try {
    const response = await dashboardClient.get('/users/roles');    
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

// Fetch postings
export const fetchPostings = async () => {
  try {
    const res = await dashboardClient.get('/users/office-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching postings:', err);
    return [];
  }
};

// Fetch projects
export const fetchProjects = async () => {
  try {
    const res = await dashboardClient.get('/dashboard/project-details');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
};

// Assign roles & projects
export const assignRolesAndProjects = async (assignData) => {
  try {
    const res = await dashboardClient.post('/users/assign', assignData);
    return res.data;
  } catch (err) {
    console.error('Error assigning roles/projects:', err);
    throw err;
  }
};

// Fetch assigned users
export const fetchAssignedUsers = async () => {
  try {
    const res = await dashboardClient.get('/users/assigned');
    console.log("assigned>>>"+res.data.data);
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching assigned users:', err);
    return [];
  }
};

export const doRealeseEmp = async (id) => {
  try {
    const res = await dashboardClient.get(`/dashboard/release-emp/${id}`);
    alert(res.data?.data);
    return res.data?.data || [];
  } catch (err) {
    console.error('Error Releasing:', err);
    return [];
  }
};

export const profile_img_url = 'http://localhost:8082/api/uploads/profile-pics';
export const keyicon = '../images/keyic.png';  
export const defaultavatar = '../images/defaultavatar.png';