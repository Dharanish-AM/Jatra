import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const defaultSearchParams = {
  from: '',
  to: '',
  date: '',
  passengers: 1,
  type: 'Both',
};

export const useSearchStore = create(
  persist(
    (set) => ({
      searchParams: defaultSearchParams,
      setSearch: (params) =>
        set((state) => ({
          searchParams: {
            ...state.searchParams,
            ...params,
          },
        })),
      resetSearch: () => set({ searchParams: defaultSearchParams }),
    }),
    {
      name: 'jatra-search-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ searchParams: state.searchParams }),
    },
  ),
);
