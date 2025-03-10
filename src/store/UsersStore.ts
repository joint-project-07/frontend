import { create } from "zustand";

interface FormData {
  agree_marketing: boolean;
  agree_privacy: boolean;
  agree_terms: boolean;
  agree_all:  boolean | undefined;
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  phone_number: string;
}

interface UsersState {
  form: FormData;
  setForm: (newForm: Partial<FormData>) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  form: {
    email: "",
    password: "",
    password_confirm: "",
    name: "",
    phone_number: "",
    agree_all: undefined,
    agree_marketing: false,
    agree_privacy: false,
    agree_terms: false
  },
  setForm: (newForm) =>
    set((state) => ({
      form: { ...state.form, ...newForm },
    })),
}));
