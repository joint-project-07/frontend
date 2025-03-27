import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  selectedShelter: {
    shelter_name: string;
    description: string;
  } | null;
  rating: number;
  feedback: string;
  isSubmitted: boolean;
  submittedRating: number;
  openModal: (shelter: { shelter_name: string; description: string }) => void;
  closeModal: () => void;
  setRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  resetSurvey: () => void;
  setSubmitted: (submitted: boolean) => void;
  setSubmittedRating: (rating: number) => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedShelter: null,
  rating: 0,
  feedback: "",
  isSubmitted: false,
  submittedRating: 0,
  openModal: (shelter) => set({ isOpen: true, selectedShelter: shelter }),
  closeModal: () => set({ isOpen: false, selectedShelter: null }),
  setRating: (rating) => set({ rating }),
  setFeedback: (feedback) => set({ feedback }),
  resetSurvey: () => set({ rating: 0, feedback: "" }),
  setSubmitted: (submitted) => set({ isSubmitted: submitted }),
  setSubmittedRating: (rating) => set({ submittedRating: rating }),
}));

export default useModalStore;
