import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  selectedShelter: {
    shelter_name: string;
    description: string;
  } | null;
  rating: number;
  feedback: string;
  openModal: (shelter: { shelter_name: string; description: string }) => void;
  closeModal: () => void;
  setRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  resetSurvey: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedShelter: null,
  rating: 0,
  feedback: "",
  openModal: (shelter) =>
    set({ isOpen: true, selectedShelter: shelter }),
  closeModal: () =>
    set({ isOpen: false, selectedShelter: null }),
  setRating: (rating) => set({ rating }),
  setFeedback: (feedback) => set({ feedback }),
  resetSurvey: () => set({ rating: 0, feedback: "" }),
}));