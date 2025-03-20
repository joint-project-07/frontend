import { axiosInstance } from "./index";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const login = async (credentials: LoginCredentials) => {
  return await axiosInstance.post<LoginResponse>(`/api/users/login/`, credentials);
};

export const loginWithKakao = async (code: string) => {
  return await axiosInstance.post<LoginResponse>(`/api/users/kakao/login/`, { code });
};

export const logout = async (refreshToken: string) => {
  return await axiosInstance.post(`/api/users/logout/`, { refresh_token: refreshToken });
};

export const refreshAccessToken = async (refreshToken: string) => {
  return await axiosInstance.post<{access_token: string}>(`/api/users/token/refresh/`, { refresh_token: refreshToken });
};