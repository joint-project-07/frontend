import { create } from "zustand";

interface ShelterData {
  application_id: number;
  recruitment_id: number;
  shelter_name: string;
  date: string;
  description: string;
  status: string;
}

interface ShelterState {
  shelterList: ShelterData[];
  setShelterList: (data: ShelterData[]) => void;
}

export const useShelterStore = create<ShelterState>((set) => ({
  shelterList: [
    {
      application_id: 12,
      recruitment_id: 5,
      shelter_name: "행복보호소",
      date: "2025-04-10",
      description: "유기견 산책 및 환경 정화 활동",
      status: "pending",
    },
    {
      application_id: 15,
      recruitment_id: 7,
      shelter_name: "희망보호소",
      date: "2025-04-15",
      description: "보호소 청소 및 동물 돌보기",
      status: "approved",
    },
  ],
  setShelterList: (data) => set({ shelterList: data }),
}));
