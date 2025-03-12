import authClient from './AuthClient';
import authService from '../api/services/authService';
import { AuthUser, SocialAuthProvider, SocialAuthRequest } from './types';

const KAKAO_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_KAKAO_CLIENT_ID || '',
  REDIRECT_URI: process.env.REACT_APP_KAKAO_REDIRECT_URI || '',
  AUTH_URL: 'https://kauth.kakao.com/oauth/authorize',
  TOKEN_URL: 'https://kauth.kakao.com/oauth/token',
};

class KakaoAuthProvider {
  login(): Promise<AuthUser> {
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

  async unlink(): Promise<void> {
    try {
      await authService.unlinkSocialAccount(SocialAuthProvider.KAKAO);
    } catch (error) {
      console.error('카카오 계정 연결 해제 중 오류:', error);
      throw error;
    }
  }
}

export const kakaoAuthProvider = new KakaoAuthProvider();