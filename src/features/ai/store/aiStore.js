import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAIStore = create(
  persist(
    (set) => ({
      aiPickedRouteId: null,
      apiKey: '',
      setAiPick: (routeId) => set({ aiPickedRouteId: routeId }),
      setApiKey: (apiKey) => set({ apiKey }),
    }),
    {
      name: 'jatra-ai-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        apiKey: state.apiKey,
        aiPickedRouteId: state.aiPickedRouteId,
      }),
    },
  ),
);
