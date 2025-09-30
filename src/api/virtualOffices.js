// src/api/virtualOffices.js

import { api } from './axios';

export const getVirtualOffices = async (companyId) => {
  const res = await api.get(`/companies/${companyId}/virtual-offices`);
  return res.data;
};

export const createVirtualOffice = async ({ companyId, data }) => {
  const res = await api.post(`/companies/${companyId}/virtual-offices`, data);
  return res.data;
};

export const updateVirtualOffice = async ({ companyId, virtualOfficeId, data }) => {
  const res = await api.patch(
    `/companies/${companyId}/virtual-offices/${virtualOfficeId}`,
    data
  );
  return res.data;
};

export const deleteVirtualOffice = async ({ companyId, virtualOfficeId }) => {
  const res = await api.delete(
    `/companies/${companyId}/virtual-offices/${virtualOfficeId}`
  );
  return res.data;
};

export const uploadVirtualOfficeBackground = async ({
  companyId,
  virtualOfficeId,
  file,
}) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post(
    `/companies/${companyId}/virtual-offices/${virtualOfficeId}/backgrounds`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};

export const uploadVirtualOfficeAvatar = async ({
  companyId,
  virtualOfficeId,
  file,
}) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post(
    `/companies/${companyId}/virtual-offices/${virtualOfficeId}/avatar`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};

export const deleteVirtualOfficeAvatar = async ({ companyId, virtualOfficeId }) => {
  const res = await api.delete(
    `/companies/${companyId}/virtual-offices/${virtualOfficeId}/avatar`
  );
  return res.data;
};