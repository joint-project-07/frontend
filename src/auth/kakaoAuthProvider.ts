import { 
  AuthUser, 
  SocialAuthProvider, 
  SocialAuthRequest, 
} from './types';
import authClient from '../auth/AuthClient';
import mockAuthService from '../service/mock/mockAuthService';

const isDevelopment = true; 

const authService = isDevelopment ? mockAuthService : mockAuthService;

const KAKAO_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_KAKAO_CLIENT_ID || 'mock_kakao_client_id',
  REDIRECT_URI: process.env.REACT_APP_KAKAO_REDIRECT_URI || 'http://localhost:3000/oauth/callback/kakao',
  AUTH_URL: 'https://kauth.kakao.com/oauth/authorize',
  TOKEN_URL: 'https://kauth.kakao.com/oauth/token',
  SDK_URL: 'https://developers.kakao.com/sdk/js/kakao.js',
};

interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

interface KakaoApiError {
  error: string;
  error_description?: string;
  code?: number;
  msg?: string;
}

export const mockGenerateKakaoCode = (): string => {
  return 'mock_kakao_auth_code_' + Math.random().toString(36).substring(2, 10);
};

class KakaoAuthProvider {
  private kakaoSDKLoaded = false;

  constructor() {
    if (isDevelopment) {
      console.log('[개발 모드] 카카오 SDK 대신 모의 구현을 사용합니다.');
      this.kakaoSDKLoaded = true; 
    } else {
      this.loadKakaoSDK();
    }
  }

  login(): Promise<AuthUser> {
    if (isDevelopment) {
      console.log('[Mock] 카카오 로그인 리디렉션 (개발 환경에서는 실제 리디렉션 없음)');
      
      return this.processCode(mockGenerateKakaoCode());
    }
    
    return new Promise((_resolve, reject) => {
      try {
        window.location.href = this.getAuthUrl();
      } catch (error) {
        reject(error);
      }
    });
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: KAKAO_CONFIG.CLIENT_ID,
      redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
      response_type: 'code',
    });

    return `${KAKAO_CONFIG.AUTH_URL}?${params.toString()}`;
  }

  async processCode(code: string): Promise<AuthUser> {
    console.log(`카카오 인증 코드 처리: ${code.substring(0, 10)}...`);
    
    try {
      const authData: SocialAuthRequest = {
        accessToken: code,
        provider: SocialAuthProvider.KAKAO
      };
      
      const response = await authService.socialLogin(authData);
      return authClient.handleAuthResponse(response);
    } catch (error) {
      console.error('카카오 인증 코드 처리 중 오류:', error);
      throw error;
    }
  }

  async loginWithSdk(): Promise<AuthUser> {
    if (isDevelopment) {
      console.log('[Mock] 카카오 SDK 로그인 실행');
      
      const mockResponse = await authService.socialLogin({
        accessToken: 'mock_kakao_access_token',
        provider: SocialAuthProvider.KAKAO
      });
      
      return authClient.handleAuthResponse(mockResponse);
    }
    
    if (!this.kakaoSDKLoaded) {
      await this.ensureKakaoSDKLoaded();
    }

    const kakao = (window as any).Kakao;
    if (!kakao || !kakao.Auth) {
      throw new Error('카카오 SDK가 로드되지 않았습니다.');
    }

    return new Promise<AuthUser>((resolve, reject) => {
      kakao.Auth.login({
        success: async (response: KakaoAuthResponse) => {
          try {
            const user = await this.authenticateWithBackend(response.access_token);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        },
        fail: (error: KakaoApiError) => reject(error)
      });
    });
  }

  private async authenticateWithBackend(kakaoToken: string): Promise<AuthUser> {
    const response = await authService.socialLogin({
      accessToken: kakaoToken,
      provider: SocialAuthProvider.KAKAO
    });

    return authClient.handleAuthResponse(response);
  }

  private async ensureKakaoSDKLoaded(): Promise<void> {
    if (this.kakaoSDKLoaded) {
      return;
    }
    
    return new Promise<void>(resolve => {
      const checkLoaded = () => {
        if (this.kakaoSDKLoaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  private loadKakaoSDK(): void {
    if (document.getElementById('kakao-sdk')) {
      this.initializeKakaoSDK();
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = KAKAO_CONFIG.SDK_URL;
    script.onload = () => this.initializeKakaoSDK();
    script.async = true;
    
    document.head.appendChild(script);
    console.log('카카오 SDK 스크립트 태그 추가됨');
  }

  private initializeKakaoSDK(): void {
    const kakao = (window as any).Kakao;
    
    if (!kakao || typeof kakao.init !== 'function') {
      console.error('카카오 SDK가 제대로 로드되지 않았습니다');
      
      if (isDevelopment) {
        this.kakaoSDKLoaded = true;
      }
      return;
    }

    if (!kakao.isInitialized()) {
      kakao.init(KAKAO_CONFIG.CLIENT_ID);
      console.log('카카오 SDK 초기화 성공');
    } else {
      console.log('카카오 SDK가 이미 초기화되어 있습니다');
    }
    
    this.kakaoSDKLoaded = true;
  }

  async logout(): Promise<void> {
    if (isDevelopment) {
      console.log('[Mock] 카카오 로그아웃 실행');
      await authClient.logout();
      return;
    }
    
    const kakao = (window as any).Kakao;
    if (this.kakaoSDKLoaded && 
        kakao && 
        kakao.Auth && 
        kakao.Auth.getAccessToken()) {
      await new Promise<void>((resolve) => {
        kakao.Auth.logout(() => {
          resolve();
        });
      });
    }

    await authClient.logout();
  }

  async unlink(): Promise<void> {
    if (isDevelopment) {
      console.log('[Mock] 카카오 계정 연결 해제 실행');
      await authService.unlinkSocialAccount(SocialAuthProvider.KAKAO);
      await authClient.logout();
      return;
    }
    
    const kakao = (window as any).Kakao;
    if (this.kakaoSDKLoaded && 
        kakao && 
        kakao.API) {
      await new Promise<void>((resolve, reject) => {
        kakao.API.request({
          url: '/v1/user/unlink',
          success: () => resolve(),
          fail: (error: KakaoApiError) => reject(error)
        });
      });
    }
    
    await authService.unlinkSocialAccount(SocialAuthProvider.KAKAO);
    await authClient.logout();
  }
}

export const kakaoAuthProvider = new KakaoAuthProvider();

export default kakaoAuthProvider;