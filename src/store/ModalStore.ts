import { create } from 'zustand';

// 모달 데이터 타입 정의
interface ModalData {
  shelter_name?: string;
  description?: string;
  recruitmentId?: number;
  shelterId?: number;
}

// 모달 상태 인터페이스
interface ModalState {
  // 모달 표시 상태
  isOpen: boolean;
  
  // 모달 데이터
  modalData: ModalData | null;
  
  // 평가 관련 상태
  rating: number;
  feedback: string;
  isSubmitted: boolean;
  submittedRating: number;
  
  // 모달 열기/닫기 함수
  openModal: (data: ModalData) => void;
  closeModal: () => void;
  
  // 평가 관련 함수
  setRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  resetSurvey: () => void;
  setSubmitted: (submitted: boolean) => void;
  setSubmittedRating: (rating: number) => void;
}

const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  isOpen: false,
  modalData: null,
  rating: 0,
  feedback: "",
  isSubmitted: false,
  submittedRating: 0,
  
  // 모달 열기 - 합쳐진 데이터 구조 사용
  openModal: (data) => set({ 
    isOpen: true, 
    modalData: data 
  }),
  
  // 모달 닫기
  closeModal: () => set({ 
    isOpen: false, 
    modalData: null 
  }),
  
  // 평가 관련 함수들
  setRating: (rating) => set({ rating }),
  setFeedback: (feedback) => set({ feedback }),
  resetSurvey: () => set({ rating: 0, feedback: "" }),
  setSubmitted: (submitted) => set({ isSubmitted: submitted }),
  setSubmittedRating: (rating) => set({ submittedRating: rating }),
}));

export default useModalStore;