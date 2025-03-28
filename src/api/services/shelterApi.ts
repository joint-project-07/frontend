import { axiosInstance } from "../axios/axiosInstance";

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

// 보호소 회원가입 (FormData 버전)
export const shelterSignup = async (formData: FormData) => {
  const response = await axiosInstance.post(
    "/api/users/signup/shelter/",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response;
};

// 기존 uploadBusinessLicense 함수는 제거