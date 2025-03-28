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

// 사업자등록증 업로드 응답 타입
interface BusinessLicenseResponse {
  id: string;
  business_license_file: string;
  business_number: string;
  business_name: string;
  status: "pending" | "approved" | "rejected";
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

// 사업자등록증 파일 업로드
export const uploadBusinessLicense = async (
  file: File,
  businessNumber?: string,
  businessName?: string
): Promise<BusinessLicenseResponse> => {
  // FormData 객체 생성
  const formData = new FormData();

  // 파일 추가
  formData.append("business_license_file", file);

  // 추가 정보가 있으면 FormData에 추가
  if (businessNumber) {
    formData.append("business_number", businessNumber);
  }

  if (businessName) {
    formData.append("business_name", businessName);
  }

  // multipart/form-data로 전송
  const response = await axiosInstance.post(
    "/api/shelters/license/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
