import axios, { AxiosError } from 'axios';
import { 
  AuthUser, 
  SocialAuthProvider, 
  SocialAuthRequest, 
  AuthResponse,
  UserRole
} from './types';
import authClient from '../auth/AuthClient';

const isDevelopment = process.env.NODE_ENV === 'development';

const KAKAO_CONFIG = {
  CLIENT_ID: import.meta.env.KAKAO_REST_API_KEY || 'mock_kakao_client_id',
  REDIRECT_URI: import.meta.env.KAKAO_REDIRECT_URI || 'http://localhost:3000/oauth/callback/kakao',
  AUTH_URL: 'https://kauth.kakao.com/oauth/authorize',
  TOKEN_URL: 'https://kauth.kakao.com/oauth/token',
};

class KakaoAuthProvider {
  // 인증 URL 생성
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: KAKAO_CONFIG.CLIENT_ID,
      redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
      response_type: 'code',
    });

    return `${KAKAO_CONFIG.AUTH_URL}?${params.toString()}`;
  }

  // 로그인 리디렉션
  login(): void {
    if (isDevelopment) {
      console.log('[Mock] 카카오 로그인 리디렉션 (개발 환경)');
      return;
    }
    
    window.location.href = this.getAuthUrl();
  }

  // 토큰 교환
  async exchangeCodeForToken(code: string): Promise<string> {
    if (isDevelopment) {
      console.log(`[Mock] 토큰 교환 (개발 환경) - 코드: ${code}`);
      return 'mock_kakao_access_token';
    }

    try {
      const response = await axios.post(KAKAO_CONFIG.TOKEN_URL, new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_CONFIG.CLIENT_ID,
        redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
        code: code
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.access_token;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('카카오 토큰 교환 중 오류:', error.response?.data || error.message);
      }
      throw error;
    }
  }

  // 백엔드 인증
  async processCode(code: string): Promise<AuthUser> {
    const accessToken = await this.exchangeCodeForToken(code);
    
    const authData: SocialAuthRequest = {
      accessToken,
      provider: SocialAuthProvider.KAKAO
    };
    
    const response = await this.socialLogin(authData);
    return authClient.handleAuthResponse(response);
  }

  // 소셜 로그인 (백엔드 API)
  async socialLogin(authData: SocialAuthRequest): Promise<AuthResponse> {
    if (isDevelopment) {
      console.log('[Mock] 소셜 로그인 요청:', authData);
      
      return {
        accessToken: 'mock_jwt_access_token',
        refreshToken: 'mock_jwt_refresh_token',
        user: {
          id: 'kakao_user_' + Math.random().toString(36).substring(2, 10),
          name: '카카오 사용자',
          email: 'kakao_user@example.com',
          role: UserRole.USER,
          socialProvider: SocialAuthProvider.KAKAO,
          profileImage: 'https://via.placeholder.com/150',
          createdAt: '',
          updatedAt: ''
        }
      };
    }

    try {
      const response = await axios.post<AuthResponse>('/api/auth/social-login', authData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('소셜 로그인 API 요청 중 오류:', error.response?.data || error.message);
      }
      throw error;
    }
  }

  // 로그아웃
  async logout(): Promise<void> {
    if (isDevelopment) {
      console.log('[Mock] 카카오 로그아웃');
      await authClient.logout();
      return;
    }

    try {
      await axios.post('/api/auth/kakao/logout');
      await authClient.logout();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('로그아웃 중 오류:', error.response?.data || error.message);
      }
      await authClient.logout();
    }
  }

  // 연결 해제
  async unlink(): Promise<void> {
    if (isDevelopment) {
      console.log('[Mock] 카카오 계정 연결 해제');
      return;
    }

    try {
      await axios.post('/api/auth/kakao/unlink');
      await this.unlinkSocialAccount();
      await authClient.logout();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('계정 연결 해제 중 오류:', error.response?.data || error.message);
      }
      await authClient.logout();
    }
  }

  // 소셜 계정 연결 해제 (백엔드 API)
  private async unlinkSocialAccount(): Promise<void> {
    if (isDevelopment) {
      console.log('[Mock] 백엔드 소셜 계정 연결 해제');
      return;
    }

    try {
      await axios.post('/api/auth/unlink-social', {
        provider: SocialAuthProvider.KAKAO
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('백엔드 소셜 계정 연결 해제 중 오류:', error.response?.data || error.message);
      }
      throw error;
    }
  }
}

export const kakaoAuthProvider = new KakaoAuthProvider();

export default kakaoAuthProvider;