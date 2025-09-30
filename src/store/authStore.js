import { create } from 'zustand';
import { loginUser, getLoginUser } from '../api/auth';
import { getToken, setToken, clearToken } from '../helpers/utils/tokenStorage';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: getToken(),
  isAuthChecked: false,

  login: async ({ email, password, rememberMe }) => {
    try {
      const loginRes = await loginUser({ email, password });
      const token = loginRes.access_token;

      setToken(token, rememberMe);
      const user = await getLoginUser();

      set({ accessToken: token, user });
      return user;
    } catch (err) {
      clearToken();
      set({ accessToken: null, user: null });
      throw err;
    }
  },

  loadUserFromStorage: async () => {
    const token = getToken();
    if (!token) {
      set({ isAuthChecked: true });
      return;
    }

    try {
      const user = await getLoginUser();
      set({ user, accessToken: token, isAuthChecked: true });
    } catch (err) {
      clearToken();
      set({ accessToken: null, isAuthChecked: true });
    }
  },

  logout: () => {
    clearToken();
    set({ accessToken: null, user: null, isAuthChecked: true });
  },
}));
