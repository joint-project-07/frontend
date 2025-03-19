import { 
    AuthResponse, 
    SocialAuthProvider, 
    SocialAuthRequest, 
    UserRole,
    LoginCredentials,
    RegisterCredentials,
    AuthUser
  } from '../../types/auth-types';
  
  const currentDate = new Date().toISOString();
  
  // 모의 사용자 데이터
  const mockUser: AuthUser = {
    id: '123456',
    name: '테스트 사용자',
    email: 'test_user@example.com',
    profileImage: 'https://via.placeholder.com/150',
    role: UserRole.USER,
    createdAt: currentDate,
    updatedAt: currentDate
  };
  
  // 모의 카카오 사용자 데이터
  const mockKakaoUser: AuthUser = {
    id: '789012',
    name: '카카오 테스트 사용자',
    email: 'kakao_user@example.com',
    profileImage: 'https://via.placeholder.com/150',
    role: UserRole.USER,
    socialProvider: SocialAuthProvider.KAKAO,
    socialId: 'kakao_1234567890',
    createdAt: currentDate,
    updatedAt: currentDate
  };
  
  // 목(mock) 사용자 데이터베이스
  const mockUserDatabase: AuthUser[] = [
    mockUser,
    mockKakaoUser
  ];
  
  const mockAuthService = {
    // 소셜 로그인
    socialLogin: async ({ provider }: SocialAuthRequest): Promise<AuthResponse> => {
      console.log(`[Mock] 소셜 로그인 요청 - Provider: ${provider}`);
      
      return {
        accessToken: 'mock_jwt_access_token',
        refreshToken: 'mock_jwt_refresh_token',
        user: mockKakaoUser
      };
    },
    
    // 일반 로그인
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      console.log(`[Mock] 로그인 요청 - Email: ${credentials.email}`);
      
      // 목(mock) 로그인 검증 - 이메일이 test_user@example.com이고 비밀번호가 password123인 경우에만 성공
      if (credentials.email === 'test_user@example.com' && credentials.password === 'password123') {
        return {
          accessToken: 'mock_jwt_access_token',
          refreshToken: 'mock_jwt_refresh_token',
          user: mockUser
        };
      }
      
      // 로그인 실패
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    },
    
    // 회원가입
    register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
      console.log(`[Mock] 회원가입 요청 - Email: ${userData.email}`);
      
      // 이미 존재하는 이메일인지 확인
      const existingUser = mockUserDatabase.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('이미 사용 중인 이메일입니다.');
      }
      
      // 비밀번호 확인이 있는 경우 일치 여부 확인
      if (userData.passwordConfirm && userData.password !== userData.passwordConfirm) {
        throw new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }
      
      // 새 사용자 생성
      const newUser: AuthUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 10),
        name: userData.name,
        email: userData.email,
        role: UserRole.USER,
        profileImage: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 목(mock) 데이터베이스에 추가
      mockUserDatabase.push(newUser);
      
      return {
        accessToken: 'mock_jwt_access_token',
        refreshToken: 'mock_jwt_refresh_token',
        user: newUser
      };
    },
    
    // 소셜 계정 연결 해제
    unlinkSocialAccount: async (provider: SocialAuthProvider): Promise<{ success: boolean }> => {
      console.log(`[Mock] 소셜 계정 연결 해제 요청 - Provider: ${provider}`);
      return { success: true };
    },
    
    // 사용자 정보 가져오기
    getUserInfo: async (): Promise<AuthUser> => {
      console.log('[Mock] 사용자 정보 요청');
      return mockUser;
    },
    
    // 비밀번호 재설정 요청
    requestPasswordReset: async (email: string): Promise<{ success: boolean }> => {
      console.log(`[Mock] 비밀번호 재설정 요청 - Email: ${email}`);
      
      // 존재하는 이메일인지 확인
      const user = mockUserDatabase.find(user => user.email === email);
      if (!user) {
        throw new Error('등록되지 않은 이메일입니다.');
      }
      
      return { success: true };
    },
    
    // 토큰 갱신
    refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
      console.log('[Mock] 토큰 갱신 요청');
      
      // 유효한 리프레시 토큰인지 확인 (항상 성공으로 처리)
      if (refreshToken) {
        return { accessToken: 'new_mock_jwt_access_token' };
      }
      
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }
  };
  
  export default mockAuthService;