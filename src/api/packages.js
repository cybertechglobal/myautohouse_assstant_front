import { api } from './axios';

export const getPackages = async () => {
  const res = await api.get('/packages');
  return res.data;
};

export async function createPackage(data) {
  const res = await api.post('/packages', data);
  return res.data;
}

export async function updatePackage({ packageId, data }) {
  console.log(data)
  const res = await api.patch(`/packages/${packageId}`, data);
  return res.data;
}

export async function deletePackage(packageId) {
  const res = await api.delete(`/packages/${packageId}`);
  return res.data;
}

export const getPackageById = async (packageId) => {
  const response = await api.get(`/packages/${packageId}`);
  return response.data;
};
