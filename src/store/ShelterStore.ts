import { create } from "zustand";

interface FormData {
  agree_marketing: boolean;
  agree_privacy: boolean;
  agree_terms: boolean;
  agree_all:  boolean | undefined;
  password_confirm: string;
  password: string;
  name: string;
  shelter_type: string;
  business_registration_number: string;
  business_registration_email: string;
  address: string;
  owner_name: string;
  contact_number: string;
}

interface ShelterData {
  application_id: number;
  recruitment_id: number;
  shelter_name: string;
  date: string;
  description: string;
  status: string;
}

interface ShelterState {
  form: FormData;
  setForm: (form: Partial<FormData>) => void;

  shelterList: ShelterData[];
  setShelterList: (data: ShelterData[]) => void;
}

export const useShelterStore = create<ShelterState>((set) => ({
  form: {
    name: "",
    shelter_type: "",
    business_registration_number: "",
    business_registration_email: "",
    address: "",
    owner_name: "",
    contact_number: "",
    agree_marketing: false,
    agree_privacy: false,
    agree_terms: false,
    agree_all: undefined,
    password_confirm: "",
    password: ""
  },
  setForm: (newForm) =>
    set((state) => ({
      form: { ...state.form, ...newForm },
    })),
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
