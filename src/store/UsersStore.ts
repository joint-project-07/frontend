import { create } from "zustand";

interface FormData {
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
  },
  setForm: (newForm) =>
    set((state) => ({
      form: { ...state.form, ...newForm },
    })),
}));
