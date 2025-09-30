import axios from 'axios';
import { notifyError } from '../helpers/utils/notify';
import { useAuthStore } from '../store/authStore';
import { getToken, clearToken } from '../helpers/utils/tokenStorage';

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Error';
    const isLoginRequest = error.config?.url?.includes('/login');

    if (status === 401 && !isLoginRequest) {
      clearToken();
      useAuthStore.getState().logout();

      setTimeout(() => {
        notifyError('Your session has expired. Please log in again.');
      }, 100);
    } else if (status !== 401) {
      setTimeout(() => {
        notifyError(`${status}: ${message}`);
      });
    }

    return Promise.reject(error);
  }
);
