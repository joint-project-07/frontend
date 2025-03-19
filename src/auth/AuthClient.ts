import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials, 
  SocialAuthProvider, 
  UserRole, 
  AuthResponse,
  TokenRefreshResponse,
  SocialAuthRequest
} from '../types/auth-types';

import authServiceReal from '../api/services/authService';

const isDevelopment = process.env.NODE_ENV === 'development';

const MOCK_AUTH_TOKEN = 'mock_auth_token';
const MOCK_USER_KEY = 'mock_current_user';
const MOCK_AUTH_STATE = 'mock_auth_state';

const currentDate = new Date().toISOString();

const mockUsers: AuthUser[] = [
  {
    id: '123456',
    name: '테스트 사용자',
    email: 'test_user@example.com',
    role: UserRole.USER, 
    profileImage: 'https://via.placeholder.com/150',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: '789012',
    name: '카카오 테스트 사용자',
    email: 'kakao_user@example.com',
    role: UserRole.USER, 
    profileImage: 'https://via.placeholder.com/150',
    socialProvider: SocialAuthProvider.KAKAO, 
    socialId: 'kakao_1234567890',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

interface IAuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser>;
  refreshToken: (refreshToken: string) => Promise<TokenRefreshResponse>;
  socialLogin: (socialAuthData: SocialAuthRequest) => Promise<AuthResponse>;
  unlinkSocialAccount: (provider: string) => Promise<{ message: string }>;
  requestPasswordReset: (email: string) => Promise<{ message: string }>;
}

const mockAuthService: IAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log(`[Mock] 로그인 요청 - Email: ${credentials.email}`);
    
    if (credentials.email === 'test_user@example.com' && credentials.password === 'password123') {
      return {
        accessToken: 'mock_jwt_access_token',
        refreshToken: 'mock_jwt_refresh_token',
        user: mockUsers[0]
      };
    }
    
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  },
  
  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    console.log(`[Mock] 회원가입 요청 - Email: ${userData.email}`);
    
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }
    
    if (userData.passwordConfirm && userData.password !== userData.passwordConfirm) {
      throw new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
    
    const newUser: AuthUser = {
      id: 'user_' + Math.random().toString(36).substring(2, 10),
      email: userData.email,
      name: userData.name, 
      username: userData.username, 
      role: userData.role || UserRole.USER, 
      profileImage: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    return {
      accessToken: 'mock_jwt_access_token',
      refreshToken: 'mock_jwt_refresh_token',
      user: newUser
    };
  },
  
  logout: async (): Promise<void> => {
    console.log('[Mock] 로그아웃 요청');
    return Promise.resolve();
  },
  
  getCurrentUser: async (): Promise<AuthUser> => {
    console.log('[Mock] 현재 사용자 정보 요청');
    return mockUsers[0];
  },
  
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    console.log('[Mock] 토큰 갱신 요청');
    
    if (refreshToken) {
      return { accessToken: 'new_mock_jwt_access_token' };
    }
    
    throw new Error('유효하지 않은 리프레시 토큰입니다.');
  },
  
  socialLogin: async (socialAuthData: SocialAuthRequest): Promise<AuthResponse> => {
    console.log(`[Mock] 소셜 로그인 요청 - Provider: ${socialAuthData.provider}`);
    
    return {
      accessToken: 'mock_jwt_access_token',
      refreshToken: 'mock_jwt_refresh_token',
      user: mockUsers[1] 
    };
  },
  
  unlinkSocialAccount: async (provider: string): Promise<{ message: string }> => {
    console.log(`[Mock] 소셜 계정 연결 해제 요청 - Provider: ${provider}`);
    return { message: '소셜 계정 연결이 해제되었습니다.' };
  },
  
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    console.log(`[Mock] 비밀번호 재설정 요청 - Email: ${email}`);
    
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      throw new Error('등록되지 않은 이메일입니다.');
    }
    
    return { message: '비밀번호 재설정 이메일이 발송되었습니다.' };
  }
};

class AuthClient {
  private user: AuthUser | null = null;
  private isAuthenticated = false;

  constructor() {
    this.restoreAuth();
  }

  private restoreAuth(): void {
    const accessToken = localStorage.getItem('accessToken');
    const userJson = localStorage.getItem('user');

    if (accessToken && userJson) {
      try {
        const parsedUser = JSON.parse(userJson);
        
        if (
          parsedUser &&
          typeof parsedUser.id === 'string' &&
          typeof parsedUser.email === 'string' &&
          typeof parsedUser.role === 'string' &&
          typeof parsedUser.createdAt === 'string' &&
          typeof parsedUser.updatedAt === 'string'
        ) {
          this.isAuthenticated = true;
          this.user = parsedUser as AuthUser;
        } else {
          this.clearAuth();
        }
      } catch (error) {
        console.error('사용자 정보 파싱 중 오류:', error);
        this.clearAuth();
      }
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.isAuthenticated = false;
    this.user = null;
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    console.log('로그인 시도:', credentials.email);
    const response = await (isDevelopment ? mockAuthService : authServiceReal).login(credentials);
    return this.handleAuthResponse(response);
  }

  async register(userData: RegisterCredentials): Promise<AuthUser> {
    console.log('회원가입 시도:', userData.email);
    const response = await (isDevelopment ? mockAuthService : authServiceReal).register(userData);
    return this.handleAuthResponse(response);
  }

  public handleAuthResponse(response: AuthResponse): AuthUser {
    const { accessToken, refreshToken, user } = response;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    this.isAuthenticated = true;
    this.user = user;
    
    return user;
  }

  async logout(): Promise<void> {
    try {
      await (isDevelopment ? mockAuthService : authServiceReal).logout();
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      this.clearAuth();
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.user;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  async refreshUserInfo(): Promise<AuthUser | null> {
    if (!this.isAuthenticated) {
      return null;
    }

    try {
      const user = await (isDevelopment ? mockAuthService : authServiceReal).getCurrentUser();
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
      
      // Fixed error check
      const err = error as Error;
      if (err.message.includes('401')) {
        await this.logout();
      }
      
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return null;
      }
      
      const response = await (isDevelopment ? mockAuthService : authServiceReal).refreshToken(refreshToken);
      const newAccessToken = response.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      await this.logout();
      return null;
    }
  }

  async setMockUser(mockUser: AuthUser): Promise<void> {
    if (isDevelopment) {
      localStorage.setItem(MOCK_AUTH_TOKEN, 'mock_token_' + Date.now());
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(MOCK_AUTH_STATE, 'true');
      
      this.isAuthenticated = true;
      this.user = mockUser;
    } else {
      throw new Error('이 함수는 개발 환경에서만 사용할 수 있습니다.');
    }
  }
}

const authClient = new AuthClient();

export default authClient;