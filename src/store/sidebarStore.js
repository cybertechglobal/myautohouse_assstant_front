import { create } from 'zustand';

export const useSidebarStore = create((set) => ({
  isOpen: true,
  mobileOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}));