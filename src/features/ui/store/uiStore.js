import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isAIChatOpen: false,
  setIsAIChatOpen: (isOpen) => set({ isAIChatOpen: isOpen }),
  isCompareModalOpen: false,
  setIsCompareModalOpen: (isOpen) => set({ isCompareModalOpen: isOpen }),
}));
