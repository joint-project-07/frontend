import { create } from 'zustand';
import authClient from '../../auth/AuthClient';
import { kakaoAuthProvider } from '../../auth/kakaoAuthProvider';
import authService from '../../api/services/authService';
import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials, 
  SocialAuthProvider,
  UserRole
} from '../../types/auth-types'; 

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (userData: RegisterCredentials) => Promise<AuthUser>;
  loginWithKakao: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  unlinkSocialAccount: (provider: SocialAuthProvider) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  
  // 추가된 함수들
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
  processKakaoAuth: (code: string) => Promise<AuthUser>;
  
  // 목업 환경용 함수 추가
  loginAs: (role: UserRole) => Promise<AuthUser>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: authClient.getCurrentUser(),
  isAuthenticated: authClient.isUserAuthenticated(),
  isLoading: false,
  error: null,
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetError: () => set({ error: null }),
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await authClient.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  // 목업 환경용 함수 추가
  loginAs: async (role) => {
    set({ isLoading: true, error: null });
    
    try {
      // 목업 로그인 처리
      const mockUser: AuthUser = {
        id: `mock_${Math.random().toString(36).substring(2, 9)}`,
        email: `${role.toLowerCase()}@example.com`,
        username: role === UserRole.VOLUNTEER ? '봉사자' : '봉사기관',
        name: role === UserRole.VOLUNTEER ? '봉사자' : '봉사기관',
        role: role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // localStorage 저장 로직은 authClient로 위임
      await authClient.setMockUser(mockUser);
      
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      console.log(`[목업] ${role} 역할로 로그인되었습니다.`, mockUser);
      return mockUser;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await authClient.register(userData);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '회원가입 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  loginWithKakao: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await kakaoAuthProvider.login();
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '카카오 로그인 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  processKakaoAuth: async (code) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await kakaoAuthProvider.processCode(code);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '카카오 인증 처리 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authClient.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
      set({ isLoading: false });
    }
  },
  
  refreshUserInfo: async () => {
    const { isAuthenticated } = get();
    if (!isAuthenticated) return;
    
    set({ isLoading: true });
    
    try {
      const userData = await authClient.refreshUserInfo();
      if (userData) {
        set({ user: userData, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('사용자 정보 갱신 중 오류가 발생했습니다:', error);
      
      const err = error as Error;
      if (err.message.includes('401')) {
        await get().logout();
      } else {
        set({ isLoading: false });
      }
    }
  },
  
  unlinkSocialAccount: async (provider) => {
    set({ isLoading: true, error: null });
    
    try {
      if (provider === SocialAuthProvider.KAKAO) {
        await kakaoAuthProvider.unlink();
      } else {
        await authService.unlinkSocialAccount(provider);
      }
      await get().refreshUserInfo();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '소셜 계정 연결 해제 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
  
  requestPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.requestPasswordReset(email);
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  }
}));

export default useAuthStore;