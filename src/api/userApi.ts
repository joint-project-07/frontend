import { UserRole } from "../contexts/AuthContext";
import { axiosInstance } from "./axios/axiosInstance";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface UserInfo {
  id: number; 
  email: string;
  name: string;
  contact_number: string;
  profile_image: string | null;
  role: UserRole;
}

export interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  contact_number: string;
  marketing_consent: boolean;
}

export interface FindEmailRequest {
  name: string;
  contact_number: string;
}

export interface ResetPasswordRequest {
  email: string;
  contact_number: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface TempPasswordRequest {
  email: string;
  name: string;
  contact_number: string;
  marketing_consent: boolean;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  profile_image?: File;
}

export interface KakaoLoginRequest {
  access_token: string;
}

export const login = async (credentials: LoginCredentials) => {
  return await axiosInstance.post('/api/users/login/', credentials);
};

export const logout = async (data: LogoutRequest) => {
  return await axiosInstance.post('/api/users/logout/', data);
};

export const processKakaoLogin = async (data: KakaoLoginRequest) => {
  return await axiosInstance.post('/api/users/kakao-login/', data);
};

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get<UserInfo>('/api/users/me/');
    return response.data;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw error;
  }
};

export const updateProfile = async (data: ProfileUpdateRequest) => {
  try {
    const formData = new FormData();
    
    if (data.name) {
      formData.append('name', data.name);
    }
    
    const response = await axiosInstance.put('/api/users/me/', formData);
    
    if (data.profile_image) {
      await uploadProfileImage(data.profile_image);
    }
    
    return response;
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }
};

export const getProfileImageUrl = () => {
  return '/api/users/profile_image/';
};

export const uploadProfileImage = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post('/api/users/profile_image/detail/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('프로필 이미지 업로드 오류:', error);
    throw error;
  }
};

export const deleteProfileImage = async () => {
  try {
    const response = await axiosInstance.delete('/api/users/profile_image/detail/');
    return response.data;
  } catch (error) {
    console.error('프로필 이미지 삭제 오류:', error);
    throw error;
  }
};

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

export const findEmail = async (data: FindEmailRequest) => {
  return await axiosInstance.post(`/api/users/find-email/`, data);
};

export const resetPassword = async (data: ResetPasswordRequest) => {
  return await axiosInstance.post(`/api/users/reset-password/`, data);
};

export const changePassword = async (data: ChangePasswordRequest) => {
  return await axiosInstance.put(`/api/users/change-password/`, data);
};

export const requestTempPassword = async (userData: TempPasswordRequest) => {
  return await axiosInstance.post('/api/users/temp-password/', userData);
};

export const deleteAccount = async (data: DeleteAccountRequest) => {
  return await axiosInstance.post(`/api/users/delete/`, data);
};