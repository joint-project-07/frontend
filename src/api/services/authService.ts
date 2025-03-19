import axiosInstance from '../axios/axiosInstance';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  SocialAuthRequest, 
  TokenRefreshResponse,
  AuthUser
} from '../../types/auth-types';

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  socialLogin: async (socialAuthData: SocialAuthRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      `/auth/social/${socialAuthData.provider.toLowerCase()}`, 
      socialAuthData
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    const response = await axiosInstance.post<TokenRefreshResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<AuthUser>('/auth/me');
    return response.data;
  },

  requestEmailVerification: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/email/verify', { email });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await axiosInstance.get<{ message: string }>(`/auth/email/verify/${token}`);
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/password/reset', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(`/auth/password/reset/${token}`, {
      newPassword
    });
    return response.data;
  },

  unlinkSocialAccount: async (provider: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/social/unlink', { provider });
    return response.data;
  }
};

export default authService;