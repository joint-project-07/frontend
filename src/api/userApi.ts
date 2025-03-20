import { axiosInstance } from "../api/axios/axiosInstance";

interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  contact_number: string;
  marketing_consent: boolean;
}

export const checkEmailExists = async (email: string) => {
  return await axiosInstance.post(`/api/users/email-check/`, { email });
};

export const requestVerificationCode = async (email: string) => {
  return await axiosInstance.post(`/api/users/email-confirmation/`, { email });
};

export const verifyEmailCode = async (code: string) => {
  return await axiosInstance.post(`/api/users/verify/email-code/`, { code });
};

export const signupUser = async (signupData: SignupData) => {
  return await axiosInstance.post(`/api/users/signup/`, signupData);
};