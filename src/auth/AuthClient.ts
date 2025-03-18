import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse,
  SocialAuthProvider,
  UserRole
} from './types';

const isDevelopment = true; 

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

const mockAuthService = {
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
      name: userData.name,
      email: userData.email,
      role: UserRole.USER,
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
  
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    console.log('[Mock] 토큰 갱신 요청');
    
    if (refreshToken) {
      return { accessToken: 'new_mock_jwt_access_token' };
    }
    
    throw new Error('유효하지 않은 리프레시 토큰입니다.');
  },
  
  socialLogin: async ({ provider}: { provider: SocialAuthProvider, accessToken: string }): Promise<AuthResponse> => {
    console.log(`[Mock] 소셜 로그인 요청 - Provider: ${provider}`);
    
    return {
      accessToken: 'mock_jwt_access_token',
      refreshToken: 'mock_jwt_refresh_token',
      user: mockUsers[1] 
    };
  },
  
  unlinkSocialAccount: async (provider: SocialAuthProvider): Promise<{ success: boolean }> => {
    console.log(`[Mock] 소셜 계정 연결 해제 요청 - Provider: ${provider}`);
    return { success: true };
  },
  
  requestPasswordReset: async (email: string): Promise<{ success: boolean }> => {
    console.log(`[Mock] 비밀번호 재설정 요청 - Email: ${email}`);
    
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      throw new Error('등록되지 않은 이메일입니다.');
    }
    
    return { success: true };
  }
};

const authService = isDevelopment ? mockAuthService : {} as any; // 실제 환경에서는 import한 authService 사용

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
          typeof parsedUser.name === 'string' &&
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
    const response = await authService.login(credentials);
    return this.handleAuthResponse(response);
  }

  async register(userData: RegisterCredentials): Promise<AuthUser> {
    console.log('회원가입 시도:', userData.email);
    const response = await authService.register(userData);
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
      await authService.logout();
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
      const user = await authService.getCurrentUser();
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
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
      
      const response = await authService.refreshToken(refreshToken);
      const newAccessToken = response.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      await this.logout();
      return null;
    }
  }
}

const authClient = new AuthClient();

export default authClient;