import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const defaultSearchParams = {
  from: '',
  to: '',
  date: '',
  passengers: 1,
  type: 'Both',
};

const MAX_RECENT_SEARCHES = 6;

function normalizeRecentSearch(entry = {}) {
  return {
    from: String(entry.from ?? '').trim(),
    to: String(entry.to ?? '').trim(),
    date: String(entry.date ?? '').trim(),
    passengers: Math.max(1, Number(entry.passengers) || 1),
    type: entry.type || 'Both',
    savedAt: entry.savedAt || new Date().toISOString(),
  };
}

export const useSearchStore = create(
  persist(
    (set) => ({
      searchParams: defaultSearchParams,
      recentSearches: [],
      setSearch: (params) =>
        set((state) => ({
          searchParams: {
            ...state.searchParams,
            ...params,
          },
        })),
      addRecentSearch: (params) =>
        set((state) => {
          const normalized = normalizeRecentSearch(params);
          if (!normalized.from || !normalized.to || !normalized.date) {
            return state;
          }

          const nextRecents = state.recentSearches
            .filter(
              (item) =>
                !(
                  item.from.toLowerCase() === normalized.from.toLowerCase() &&
                  item.to.toLowerCase() === normalized.to.toLowerCase() &&
                  item.date === normalized.date &&
                  item.type === normalized.type
                ),
            )
            .slice(0, MAX_RECENT_SEARCHES - 1);

          return {
            recentSearches: [normalized, ...nextRecents],
          };
        }),
      removeRecentSearch: (savedAt) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item.savedAt !== savedAt),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      resetSearch: () => set({ searchParams: defaultSearchParams }),
    }),
    {
      name: 'jatra-search-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        searchParams: state.searchParams,
        recentSearches: state.recentSearches,
      }),
    },
  ),
);
