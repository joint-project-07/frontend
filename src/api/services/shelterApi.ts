import { axiosInstance } from "../axios/axiosInstance";

export const checkDuplicateEmail = async (email: string) => {
  const response = await axiosInstance.post("/api/users/email-check/", {
    email,
  });
  return response.data;
};

export const requestVerificationCode = async (email: string) => {
  const response = await axiosInstance.post("/api/users/email-confirmation/", {
    email,
  });
  return response.data;
};

export const verifyCode = async (email: string, code: string) => {
  const response = await axiosInstance.post("/api/users/verify/email-code/", {
    email,
    code,
  });
  return response;
};

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

