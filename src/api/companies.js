import { api } from './axios';

export const getCompanies = async (params) => {
  const res = await api.get(`/companies`, { params });
  return res.data;
};

export async function createCompany(data) {
  const res = await api.post('/companies', data);
  return res.data;
}

export async function updateCompany({ companyId, data }) {
  const res = await api.patch(`/companies/${companyId}`, data);
  return res.data;
}

export async function deleteCompany(companyId) {
  const res = await api.delete(`/companies/${companyId}`);
  return res.data;
}

export const getCompanyById = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

export const uploadCompanyLogo = async (companyId, formData) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  const res = await api.post(`/companies/${companyId}/logos`, formData, {
    headers,
  });
  return res.data;
};

export async function getCompanyAdmins(companyId,) {
  const res = await api.get(`/companies/${companyId}/users`);
  return res.data;
}

export async function addAdminToCompanyGroup(companyId, userId) {
  const res = await api.post(`/companies/${companyId}users`, {
    userId: userId,
  });
  return res.data;
}

export async function deleteCompanyUser(companyId, userId) {
  const res = await api.delete(`/companies/${companyId}/users/${userId}`);
  return res.data;
}

export const getCompanySummaries = async (companyId, params) => {
  const res = await api.get(`/companies/${companyId}/summaries`, { params });
  return res.data;
};

export async function updateCompanyFeature({ companyId, data }) {
  const res = await api.patch(`/companies/${companyId}/features`, data);
  return res.data;
}

export const getCompanyFeaturePrice = async (companyId) => {
  const res = await api.get(`/companies/${companyId}/feature-prices`);
  return res.data;
};

export async function deleteCompanyFeatures({companyId, featureId}) {
  console.log(companyId, featureId)
  const res = await api.delete(`/companies/${companyId}/features/${featureId}`);
  return res.data;
}