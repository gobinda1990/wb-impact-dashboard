import { dashboardClient } from './apiClient';

/* ---------------- Fetch all users ---------------- */
export const fetchUsers = async () => {
  try {
    const res = await dashboardClient.get('/users/user-details');
    return (res.data?.data || []).map(user => ({
      ...user,
      role: (user.role || []).map(r => ({ roleId: r.roleId, roleName: r.roleName })),
      projectIds: (user.projectIds || []).map(p => ({ projectId: p.projectId, projectName: p.projectName })),
      officeCds: (user.officeCds || []).map(o => ({ officeCd: o.officeCd, officeNm: o.officeNm })),
      chargeDet: (user.chargeDet || []).map(c => ({ chargeCd: c.chargeCd, chargeNm: c.chargeNm })),
      circleDet: (user.circleDet || []).map(c => ({ circleCd: c.circleCd, circleNm: c.circleNm }))
    }));
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
};

/* ---------------- Fetch assigned users ---------------- */
export const fetchAssignedUsers = async () => {
  try {
    const res = await dashboardClient.get('/users/assigned');
    return (res.data?.data || []).map(user => ({
      ...user,
      role: (user.role || []).map(r => ({ roleId: r.roleId, roleName: r.roleName })),
      projectIds: (user.projectIds || []).map(p => ({ projectId: p.projectId, projectName: p.projectName })),
      officeCds: (user.officeCds || []).map(o => ({ officeCd: o.officeCd, officeNm: o.officeNm })),
      chargeDet: (user.chargeDet || []).map(c => ({ chargeCd: c.chargeCd, chargeNm: c.chargeNm })),
      circleDet: (user.circleDet || []).map(c => ({ circleCd: c.circleCd, circleNm: c.circleNm }))
    }));
  } catch (err) {
    console.error('Error fetching assigned users:', err);
    return [];
  }
};

/* ---------------- Fetch roles ---------------- */
export const fetchRoles = async () => {
  try {
    const res = await dashboardClient.get('/users/roles');
    return (res.data?.data || []).map(r => ({
      roleId: r.roleId,
      roleName: r.roleName
    }));
  } catch (err) {
    console.error('Error fetching roles:', err);
    return [];
  }
};

/* ---------------- Fetch projects ---------------- */
export const fetchProjects = async () => {
  try {
    const res = await dashboardClient.get('/dashboard/project-details');
    return (res.data?.data || []).map(p => ({
      projectId: p.projectId,
      projectName: p.projectName
    }));
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
};

/* ---------------- Fetch offices/postings ---------------- */
export const fetchOffices = async () => {
  try {
    const res = await dashboardClient.get('/users/office-details');
    return (res.data?.data || []).map(o => ({
      officeCd: o.officeCd,
      officeNm: o.officeNm
    }));
  } catch (err) {
    console.error('Error fetching postings:', err);
    return [];
  }
};

/* ---------------- Fetch charges ---------------- */
export const fetchCharges = async () => {
  try {
    const res = await dashboardClient.get('/users/charge-details');
    return (res.data?.data || []).map(c => ({
      chargeCd: c.chargeCd,
      chargeNm: c.chargeNm
    }));
  } catch (err) {
    console.error('Error fetching charges:', err);
    return [];
  }
};

/* ---------------- Fetch circles ---------------- */
export const fetchCircles = async () => {
  try {
    const res = await dashboardClient.get('/users/circle-details');
    return (res.data?.data || []).map(c => ({
      circleCd: c.circleCd,
      circleNm: c.circleNm
    }));
  } catch (err) {
    console.error('Error fetching circles:', err);
    return [];
  }
};

/* ---------------- Assign roles & projects ---------------- */
export const assignRolesAndProjects = async (assignData) => {
  try {
    const res = await dashboardClient.post('/users/assign', assignData);
    return res.data;
  } catch (err) {
    console.error('Error assigning roles/projects:', err);
    throw err;
  }
};
