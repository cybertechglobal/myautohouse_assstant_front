import { authApi, api } from './axios';

export async function loginUser(data) {
  const res = await authApi.post('/auth/login', data);
  return res.data;
}

export async function getLoginUser() {
  const res = await api.get('/users/me');
  return res.data;
}
