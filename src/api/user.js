import { api } from './axios';

export async function getUsers({ companyId, companyGroupId, filter }) {
  const params = {
    companyId,
    companyGroupId,
    role: 'admin',
    ...filter,
  };

  const res = await api.get('/users', { params });
  return res.data;
}

export async function createUser(data) {
  const res = await api.post('/users', data);
  return res.data;
}

export async function updateUser({ userId, data }) {
  const res = await api.patch(`/users/${userId}`, data);
  return res.data;
}

export async function deleteUser(userId) {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
}