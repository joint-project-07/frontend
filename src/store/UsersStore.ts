import { create } from "zustand";

interface FormData {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  phone_number: string;
  agree_marketing: boolean;
  agree_privacy: boolean;
  agree_terms: boolean;
  agree_all: boolean | undefined;
  emailChecked: boolean;
  emailValid: boolean | null;
  loading: boolean;
  verificationCode: string;
  codeSent: boolean;
  codeVerified: boolean;
  passwordMatch: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  form: FormData;
  setForm: (newForm: Partial<FormData>) => void;
  resetForm: () => void;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
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
    agree_terms: false,
    emailChecked: false,
    emailValid: null,
    loading: false,
    verificationCode: "",
    codeSent: false,
    codeVerified: false,
    passwordMatch: true,
  },
  setForm: (newForm) =>
    set((state) => ({ form: { ...state.form, ...newForm } })),
  resetForm: () =>
    set({
      form: {
        email: "",
        password: "",
        password_confirm: "",
        name: "",
        phone_number: "",
        agree_all: undefined,
        agree_marketing: false,
        agree_privacy: false,
        agree_terms: false,
        emailChecked: false,
        emailValid: null,
        loading: false,
        verificationCode: "",
        codeSent: false,
        codeVerified: false,
        passwordMatch: true,
      },
    }),
}));

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));
