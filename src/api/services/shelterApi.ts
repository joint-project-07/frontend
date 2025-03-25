import { axiosInstance } from "../axios/axiosInstance";

// 보호소 회원가입 데이터 타입 정의
interface SignupData {
  name: string;
  shelter_type: string;
  business_registration_number: string;
  business_registration_email: string;
  address: string;
  password: string;
  password_confirm: string;
  owner_name: string;
  contact_number: string;
  agree_terms: boolean;
  agree_privacy: boolean;
  agree_marketing?: boolean;
}

// 보호소 이메일 중복 확인
export const checkDuplicateEmail = async (email: string) => {
  const response = await axiosInstance.post("/api/users/email-check/", {
    email,
  });
  return response.data;
};

// 인증 코드 요청
export const requestVerificationCode = async (email: string) => {
  const response = await axiosInstance.post("/api/users/email-confirmation/", {
    email,
  });
  return response.data;
};

// 인증 코드 검증
export const verifyCode = async (email: string, code: string) => {
  const response = await axiosInstance.post("/api/users/verify/email-code/", {
    email,
    code,
  });
  return response;
};

// 보호소 회원가입
export const shelterSignup = async (signupData: SignupData) => {
  const response = await axiosInstance.post(
    "/api/users/signup/shelter/",
    signupData
  );
  return response;
};