import { create } from 'zustand';

export const useGlobalSnackbarStore = create((set) => ({
  open: false,
  message: '',
  severity: 'success',

  showSnackbar: ({ message, severity = 'success' }) =>
    set({ open: true, message, severity }),

  closeSnackbar: () => set({ open: false }),
}));
