import { create } from 'zustand';
import { 
  login, 
  logout, 
  getUserInfo, 
  UserInfo, 
  processKakaoLogin,
  updateProfile
} from '../../api/userApi';
import { axiosInstance } from '../../api/axios/axiosInstance';
import { LoginCredentials } from '../../types/auth-types';

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
  refreshUserToken: () => Promise<void>;
  loginWithKakao: () => void;
  processKakaoAuth: (code: string) => Promise<void>;
  updateUserData: (userData: Partial<UserInfo>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
  clearAuth: () => void;
}

const KAKAO_REST_API_KEY = 'cbfe1b86b56a7e063d194679adf8c2c6';
const KAKAO_REDIRECT_URI = 'http://localhost:5173/auth/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
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
      
      const userType = credentials.email.includes('@organization.com') ? 'organization' : 'volunteer';
      localStorage.setItem('userType', userType);
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
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
      localStorage.removeItem('userType');
      localStorage.removeItem('user');
      
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  },

  refreshUserToken: async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) return;
    
    try {
      const response = await axiosInstance.post('/api/users/refresh-token/', {
        refresh_token
      });
      
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } catch (error) {
      console.error('토큰 재발급 오류:', error);
      await get().logout();
    }
  },

  checkAuthStatus: async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      set({ isAuthenticated: false });
      return false;
    }
    
    try {
      await get().refreshUserToken();
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

  loginWithKakao: () => {
    window.location.href = KAKAO_AUTH_URL;
  },

  processKakaoAuth: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log("카카오 인증 코드 처리 시작:", code);
      
      const response = await processKakaoLogin({ authorization_code: code });
      console.log("카카오 로그인 응답:", response.data);
      
      const { access_token, refresh_token, user } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('userType', 'volunteer'); 
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      console.log("카카오 로그인 완료, 인증 상태:", true);
      
    } catch (error: any) {
      console.error('카카오 로그인 오류:', error);
      const errorMessage = error.response?.data?.message || '카카오 로그인에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  },

  updateUserData: (userData: Partial<UserInfo>) => {
    const { user } = get();
    if (user) {
      console.log("업데이트 전 사용자 데이터:", user);
      console.log("업데이트할 데이터:", userData);
      
      const updatedUser = { ...user, ...userData };
      set({ user: updatedUser });
      
      console.log("업데이트 후 사용자 데이터:", updatedUser);
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const mergedUser = { ...storedUser, ...userData };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      
      if (userData.name) {
        updateProfile({ name: userData.name }).catch(console.error);
      }
    } else {
      console.log("사용자 정보가 없어 업데이트할 수 없습니다.");
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),
  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  }
}));

export default useAuthStore;