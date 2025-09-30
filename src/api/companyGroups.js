import { api } from './axios';

export async function getCompanyGroups() {
  const res = await api.get('/company-groups');
  return res.data;
}

export async function getCompanyGroup(companyGroupId) {
  const res = await api.get(`/company-groups/${companyGroupId}`);
  return res.data;
}

export async function createCompanyGroup(data) {
  const res = await api.post('/company-groups', data);
  return res.data;
}

export async function updateCompanyGroup(data) {
  const { companyGroupId, body } = data;
  const res = await api.patch(`/company-groups/${companyGroupId}`, body);
  return res.data;
}

export async function deleteCompanyGroup(companyGroupId) {
  const res = await api.delete(`/company-groups/${companyGroupId}`);
  return res.data;
}

export async function getCompanyGroupAdmins(companyGroupId) {
  const res = await api.get(`/company-groups/${companyGroupId}/users`);
  return res.data;
}

export async function addAdminToCompanyGroup(companyGroupId, userId) {
  const res = await api.post(`/company-groups/${companyGroupId}/users`, {
    userId: userId,
  });
  return res.data;
}

export async function deleteCompanyGroupUser(companyGroupId, userId) {
  const res = await api.delete(`/company-groups/${companyGroupId}/users/${userId}`);
  return res.data;
}

export const uploadCompanyGroupLogo = async (companyGroupId, formData) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  const res = await api.post(`/company-groups/${companyGroupId}/logos`, formData, {
    headers,
  });
  return res.data;
};

export async function getCompanyGroupCompanies(companyGroupId, params) {
  const parsedParams = {
    ...params,
    page: Number(params.page),
    limit: Number(params.limit),
  };
  console.log('getCompanyGroupCompanies params:', params);

  const res = await api.get(`/company-groups/${companyGroupId}/companies`, {params});

  return res.data;
}