import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAIStore = create(
  persist(
    (set) => ({
      aiPickedRouteId: null,
      setAiPick: (routeId) => set({ aiPickedRouteId: routeId }),
    }),
    {
      name: 'jatra-ai-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        aiPickedRouteId: state.aiPickedRouteId,
      }),
    },
  ),
);
