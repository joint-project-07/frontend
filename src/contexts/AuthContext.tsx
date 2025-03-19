import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  AuthUser, 
  UserRole, 
  LoginCredentials, 
  RegisterCredentials, 
  SocialAuthProvider 
} from '../types/auth-types'; 

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  loginAs: (role: UserRole) => Promise<AuthUser>; 
  register: (userData: RegisterCredentials) => Promise<AuthUser>;
  loginWithKakao: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

const MOCK_AUTH_TOKEN = 'mock_auth_token';
const MOCK_USER_KEY = 'mock_current_user';
const MOCK_AUTH_STATE = 'mock_auth_state';

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

interface MockUserCredentials {
  email?: string;
  password?: string; 
  username?: string;
  name?: string;
  role?: UserRole; 
  [key: string]: string | UserRole | undefined;
}

const createMockUser = (credentials: MockUserCredentials, role: UserRole): AuthUser => {
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

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
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

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isDevelopment) {
        if (!credentials.email || !credentials.password) {
          throw new Error('이메일과 비밀번호를 모두 입력해주세요.');
        }
        
        const role = credentials.email.includes('organization') ? UserRole.ORGANIZATION : UserRole.VOLUNTEER;
        
        const mockCredentials: MockUserCredentials = {
          email: credentials.email,
          password: credentials.password
        };
        
        const mockUser = createMockUser(mockCredentials, role);
        
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        console.log('로그인 성공:', mockUser);
        return mockUser;
      } else {
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

  const loginAs = useCallback(async (role: UserRole): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!role) {
        throw new Error('사용자 역할이 지정되지 않았습니다.');
      }
      
      if (isDevelopment) {
        const mockCredentials: MockUserCredentials = {
          email: `${role.toLowerCase()}@example.com`,
          username: role === UserRole.VOLUNTEER ? '봉사자' : '봉사기관',
          name: role === UserRole.VOLUNTEER ? '봉사자' : '봉사기관'
        };
        
        const mockUser = createMockUser(mockCredentials, role);
        
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
        
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

  const register = useCallback(async (userData: RegisterCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isDevelopment) {
        if (!userData.email || !userData.password) {
          throw new Error('이메일과 비밀번호는 필수입니다.');
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const role = userData.role || UserRole.VOLUNTEER;
        
        const mockCredentials: MockUserCredentials = {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          username: userData.username,
          role: userData.role
        };
        
        const mockUser = createMockUser(mockCredentials, role);
        
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return mockUser;
      } else {
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

  const loginWithKakao = useCallback(async (): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockUser = createMockUser({
          email: 'kakao_user@example.com',
          username: '카카오 사용자',
          name: '카카오 사용자'
        }, UserRole.VOLUNTEER);
        
        const mockSocialUser = {
          ...mockUser,
          socialProvider: SocialAuthProvider.KAKAO,
          socialId: 'kakao_' + Math.random().toString(36).substring(2, 10),
        };
        
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockSocialUser));
        localStorage.setItem(MOCK_AUTH_STATE, 'true');
        localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_kakao_token_' + Date.now());
        
        setUser(mockSocialUser);
        setIsAuthenticated(true);
        
        return mockSocialUser;
      } else {
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

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
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

  const refreshUserInfo = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      if (isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const userJson = localStorage.getItem(MOCK_USER_KEY);
        if (userJson) {
          const currentUser = JSON.parse(userJson);
          currentUser.updatedAt = new Date().toISOString();
          
          localStorage.setItem(MOCK_USER_KEY, JSON.stringify(currentUser));
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error('사용자 정보 갱신 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isDevelopment]);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isDevelopment) {
        if (!email) {
          throw new Error('이메일을 입력해주세요.');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`[목업] ${email}로 비밀번호 재설정 링크를 발송했습니다.`);
      } else {
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

  useEffect(() => {
    const checkAuthStatus = async () => {
      const hasToken = localStorage.getItem(MOCK_AUTH_TOKEN);
      if (isAuthenticated && hasToken && !user) {
        await refreshUserInfo();
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated, user, refreshUserInfo]);

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { AuthUser, LoginCredentials, RegisterCredentials };
export { UserRole, SocialAuthProvider };

export default AuthContext;