import { create } from "zustand";

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  setTotalPages: (total: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
  itemsPerPage: 5,
  totalPages: 5,
  nextPage: () =>
    set((state) => {
      if (state.currentPage < state.totalPages) {
        return { currentPage: state.currentPage + 1 };
      }
      return state;
    }),
  prevPage: () =>
    set((state) => {
      if (state.currentPage > 1) {
        return { currentPage: state.currentPage - 1 };
      }
      return state;
    }),
  setPage: (page) =>
    set((state) => {
      if (page >= 1 && page <= state.totalPages) {
        return { currentPage: page };
      }
      return state;
    }),
  setTotalPages: (total) => set(() => ({ totalPages: total })),
}));
