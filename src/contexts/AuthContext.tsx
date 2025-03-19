import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  AuthUser, 
  UserRole, 
  LoginCredentials, 
  RegisterCredentials, 
  SocialAuthProvider 
} from '../types/auth-types';  // 통합된 타입 파일에서 가져오기

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  loginAs: (role: UserRole) => Promise<AuthUser>; // 목업 환경용 함수
  register: (userData: RegisterCredentials) => Promise<AuthUser>;
  loginWithKakao: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

// 목업 인증 관련 상수
const MOCK_AUTH_TOKEN = 'mock_auth_token';
const MOCK_USER_KEY = 'mock_current_user';
const MOCK_AUTH_STATE = 'mock_auth_state';

// 컨텍스트 생성 - 기본값을 제공하여 타입 오류 방지
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
  loginAs: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
  register: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
  loginWithKakao: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
  logout: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
  refreshUserInfo: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
  requestPasswordReset: async () => { throw new Error('AuthProvider가 설정되지 않았습니다.'); },
});

// 목업 사용자 생성 함수
const createMockUser = (credentials: any, role: UserRole): AuthUser => {
  return {
    id: `mock_${Math.random().toString(36).substring(2, 9)}`,
    email: credentials.email || 'mock@example.com',
    username: credentials.username || '목업 사용자',
    name: credentials.name || '목업 사용자',
    role: role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// AuthProvider props 타입 명시적 정의
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 개발 환경 여부 확인
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 초기 상태 설정
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const userJson = localStorage.getItem(MOCK_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('사용자 정보를 파싱하는 중 오류 발생:', error);
      return null;
    }
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(MOCK_AUTH_STATE) === 'true';
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 함수
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 개발 환경에서는 목업 로그인 처리
      if (isDevelopment) {
        if (!credentials.email || !credentials.password) {
          throw new Error('이메일과 비밀번호를 모두 입력해주세요.');
        }
        
        // 목업 사용자 생성 (이메일에 'organization'이 포함되어 있으면 기관으로 설정)
        const role = credentials.email.includes('organization') ? UserRole.ORGANIZATION : UserRole.VOLUNTEER;
        const mockUser = createMockUser(credentials, role);
        
        // 상태 및 로컬 스토리지 업데이트
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
        
        // 약간의 지연 추가 (목업 API 호출 느낌)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        console.log('로그인 성공:', mockUser);
        return mockUser;
      } else {
        // 실제 환경에서는 API 호출 코드 추가 예정
        throw new Error('실제 API 연동이 구현되지 않았습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment]);

  // 특정 역할로 로그인 (목업 전용)
  const loginAs = useCallback(async (role: UserRole): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!role) {
        throw new Error('사용자 역할이 지정되지 않았습니다.');
      }
      
      // 개발 환경에서만 작동
      if (isDevelopment) {
        const mockCredentials = {
          email: `${role.toLowerCase()}@example.com`,
          username: role === UserRole.VOLUNTEER ? '봉사자' : '봉사기관',
          name: role === UserRole.VOLUNTEER ? '봉사자' : '봉사기관'
        };
        
        const mockUser = createMockUser(mockCredentials, role);
        
        // 상태 및 로컬 스토리지 업데이트
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
        
        // 약간의 지연 추가
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        console.log(`[목업] ${role} 역할로 로그인되었습니다.`, mockUser);
        return mockUser;
      } else {
        throw new Error('이 함수는 개발 환경에서만 사용 가능합니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment]);

  // 회원가입 함수
  const register = useCallback(async (userData: RegisterCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 개발 환경에서는 목업 회원가입 처리
      if (isDevelopment) {
        if (!userData.email || !userData.password) {
          throw new Error('이메일과 비밀번호는 필수입니다.');
        }
        
        // 약간의 지연 추가
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 목업 사용자 생성
        const role = userData.role || UserRole.VOLUNTEER;
        const mockUser = createMockUser(userData, role);
        
        // 상태 및 로컬 스토리지 업데이트
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return mockUser;
      } else {
        // 실제 환경에서는 API 호출 코드 추가 예정
        throw new Error('실제 API 연동이 구현되지 않았습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '회원가입 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment]);

  // 카카오 로그인 함수
  const loginWithKakao = useCallback(async (): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 개발 환경에서는 목업 카카오 로그인 처리
      if (isDevelopment) {
        // 약간의 지연 추가
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 목업 카카오 사용자 생성
        const mockUser = createMockUser({
          email: 'kakao_user@example.com',
          username: '카카오 사용자',
          name: '카카오 사용자'
        }, UserRole.VOLUNTEER);
        
        // 소셜 정보 추가
        const mockSocialUser = {
          ...mockUser,
          socialProvider: SocialAuthProvider.KAKAO,
          socialId: 'kakao_' + Math.random().toString(36).substring(2, 10),
        };
        
        // 상태 및 로컬 스토리지 업데이트
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockSocialUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_kakao_token_' + Date.now());
        
        setUser(mockSocialUser);
        setIsAuthenticated(true);
        
        return mockSocialUser;
      } else {
        // 실제 환경에서는 API 호출 코드 추가 예정
        throw new Error('카카오 로그인 API 연동이 구현되지 않았습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '카카오 로그인 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment]);

  // 로그아웃 함수
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // 개발 환경에서는 목업 로그아웃 처리
      if (isDevelopment) {
        // 약간의 지연 추가
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        // 실제 환경에서는 API 호출 코드 추가 예정
      }
      
      // 상태 및 로컬 스토리지 초기화
      localStorage.removeItem(MOCK_USER_KEY);
      localStorage.removeItem(MOCK_AUTH_STATE);
      localStorage.removeItem(MOCK_AUTH_TOKEN);
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment]);

  // 사용자 정보 갱신 함수
  const refreshUserInfo = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      // 개발 환경에서는 목업 사용자 정보 갱신
      if (isDevelopment) {
        // 약간의 지연 추가
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 현재 사용자 정보 가져오기
        const userJson = localStorage.getItem(MOCK_USER_KEY);
        if (userJson) {
          const currentUser = JSON.parse(userJson);
          // 업데이트 시간만 변경
          currentUser.updatedAt = new Date().toISOString();
          
          localStorage.setItem(MOCK_USER_KEY, JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } else {
        // 실제 환경에서는 API 호출 코드 추가 예정
      }
    } catch (error) {
      console.error('사용자 정보 갱신 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isDevelopment]);

  // 비밀번호 재설정 요청 함수
  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 개발 환경에서는 목업 비밀번호 재설정 요청
      if (isDevelopment) {
        if (!email) {
          throw new Error('이메일을 입력해주세요.');
        }
        
        // 약간의 지연 추가
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`[목업] ${email}로 비밀번호 재설정 링크를 발송했습니다.`);
      } else {
        // 실제 환경에서는 API 호출 코드 추가 예정
        throw new Error('비밀번호 재설정 API 연동이 구현되지 않았습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isDevelopment]);

  // 사용자 인증 상태 확인 및 갱신
  useEffect(() => {
    const checkAuthStatus = async () => {
      // 토큰이 있는데 사용자 정보가 없으면 정보 갱신
      const hasToken = localStorage.getItem(MOCK_AUTH_TOKEN);
      if (isAuthenticated && hasToken && !user) {
        await refreshUserInfo();
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated, user, refreshUserInfo]);

  // 인증 컨텍스트 값
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginAs,
    register,
    loginWithKakao,
    logout,
    refreshUserInfo,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅 - useAuth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 타입 내보내기
export type { AuthUser, LoginCredentials, RegisterCredentials };
export { UserRole, SocialAuthProvider };

export default AuthContext;