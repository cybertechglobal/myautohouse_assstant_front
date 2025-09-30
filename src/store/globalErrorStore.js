import { create } from 'zustand';

export const useGlobalErrorStore = create((set) => ({
  message: '',
  open: false,

  showError: (message) => set({ message, open: true }),
  closeError: () => set({ open: false }),
}));