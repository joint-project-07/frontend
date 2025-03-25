import { create } from "zustand";

// Zustand 스토어 타입 정의
interface StoreState {
  selectedDate: string;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

// Zustand 스토어 생성
const useStore = create<StoreState>((set) => ({
  selectedDate: "2025-03-10", // 📌 날짜를 고정값으로 설정
  selectedTime: null,
  setSelectedTime: (time) => set((state) => ({ ...state, selectedTime: time })),
}));

export default useStore;
