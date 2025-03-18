import { create } from "zustand";

export type TabType = 'shelter' | 'volunteer';

interface PageState {
  currentPage: number;
  totalPages: number;
}

interface Pages {
  shelter: PageState;
  volunteer: PageState;
}

interface PaginationState {
  pages: Pages;
  itemsPerPage: number;
  getPage: (tab: TabType) => number;
  getTotalPages: (tab: TabType) => number;
  nextPage: (tab: TabType) => void;
  prevPage: (tab: TabType) => void;
  setPage: (tab: TabType, page: number) => void;
  setTotalPages: (tab: TabType, total: number) => void;
}

export const usePaginationStore = create<PaginationState>((set, get) => ({
  pages: {
    shelter: {
      currentPage: 1,
      totalPages: 1
    },
    volunteer: {
      currentPage: 1,
      totalPages: 1
    }
  },
  itemsPerPage: 5,
  getPage: (tab) => {
    return get().pages[tab].currentPage;
  },
  getTotalPages: (tab) => {
    return get().pages[tab].totalPages;
  },
  nextPage: (tab) => set((state) => {
    const currentTab = state.pages[tab as keyof typeof state.pages];
    if (currentTab && currentTab.currentPage < currentTab.totalPages) {
      return {
        pages: {
          ...state.pages,
          [tab]: {
            ...currentTab,
            currentPage: currentTab.currentPage + 1
          }
        }
      };
    }
    return state;
  }),
  prevPage: (tab) => set((state) => {
    const currentTab = state.pages[tab as keyof typeof state.pages];
    if (currentTab && currentTab.currentPage > 1) {
      return {
        pages: {
          ...state.pages,
          [tab]: {
            ...currentTab,
            currentPage: currentTab.currentPage - 1
          }
        }
      };
    }
    return state;
  }),
  setPage: (tab, page) => set((state) => {
    const currentTab = state.pages[tab as keyof typeof state.pages];
    if (currentTab && page >= 1 && page <= currentTab.totalPages) {
      return {
        pages: {
          ...state.pages,
          [tab]: {
            ...currentTab,
            currentPage: page
          }
        }
      };
    }
    return state;
  }),
  setTotalPages: (tab, total) => set((state) => {
    const currentTab = state.pages[tab as keyof typeof state.pages];
    if (currentTab) {
      return {
        pages: {
          ...state.pages,
          [tab]: {
            ...currentTab,
            totalPages: total
          }
        }
      };
    }
    return state;
  })
}));