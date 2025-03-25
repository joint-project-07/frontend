import { create } from 'zustand';
import { 
  login, 
  logout, 
  getUserInfo, 
  UserInfo, 
  LoginCredentials, 
  processKakaoLogin
} from '../../api/userApi'

import { getKakaoToken } from '../../service/kakaoAuth';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<UserInfo>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
  clearAuth: () => void;
  // 추가
  processKakaoAuth: (code: string) => Promise<UserInfo>;
}

// API 오류 인터페이스 정의
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await login(credentials);
      const { access_token, refresh_token, user } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || '로그인에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        await logout({ refresh_token });
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  },

  checkAuthStatus: async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      set({ isAuthenticated: false });
      return false;
    }
    
    try {
      const userInfo = await getUserInfo();
      set({
        user: userInfo,
        isAuthenticated: true
      });
      return true;
    } catch (error) {
      console.error('인증 상태 확인 오류:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        isAuthenticated: false
      });
      return false;
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),
  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  // 추가: 카카오 인증 처리 함수
  processKakaoAuth: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      // 카카오 액세스 토큰 얻기
      const kakaoAccessToken = await getKakaoToken(code);
      
      // API에 전달할 때는 액세스 토큰을 사용
      const response = await processKakaoLogin({ access_token: kakaoAccessToken });
      const { access_token, refresh_token, user } = response.data;
      
      // 토큰 저장
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // 사용자 정보 및 인증 상태 업데이트
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || '카카오 로그인에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  }
}));

export default useAuthStore;