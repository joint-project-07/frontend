import  authService  from '../api/services/authService';
import { AuthUser, SocialAuthProvider } from './types';
import authClient from './AuthClient';

class KakaoAuthProvider {
  private readonly KAKAO_SDK_URL = 'https://developers.kakao.com/sdk/js/kakao.js';
  private readonly KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID || '';
  
  private kakaoSDKLoaded = false;

  constructor() {
    this.loadKakaoSDK();
  }

  private loadKakaoSDK(): void {
    if (document.getElementById('kakao-sdk')) {
      this.initializeKakaoSDK();
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = this.KAKAO_SDK_URL;
    script.onload = () => this.initializeKakaoSDK();
    script.async = true;
    
    document.head.appendChild(script);
  }

  private initializeKakaoSDK(): void {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(this.KAKAO_CLIENT_ID);
      this.kakaoSDKLoaded = true;
    }
  }

  async login(): Promise<AuthUser> {
    if (!this.kakaoSDKLoaded) {
      await new Promise(resolve => {
        const checkLoaded = () => {
          if (this.kakaoSDKLoaded) {
            resolve(true);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    try {
      const authObj = await new Promise<any>((resolve, reject) => {
        window.Kakao.Auth.login({
          success: (authObj: any) => resolve(authObj),
          fail: (error: any) => reject(error)
        });
      });

      return await this.authenticateWithBackend(authObj.access_token);
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      throw error;
    }
  }

  private async authenticateWithBackend(kakaoToken: string): Promise<AuthUser> {
    try {
      const response = await authService.socialLogin({
        accessToken: kakaoToken,
        provider: SocialAuthProvider.KAKAO
      });

      const { accessToken, refreshToken, user } = response;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (this.kakaoSDKLoaded && window.Kakao.Auth.getAccessToken()) {
      await new Promise<void>((resolve) => {
        window.Kakao.Auth.logout(() => {
          resolve();
        });
      });
    }
    
    await authClient.logout();
  }

  async unlink(): Promise<void> {
    if (!this.kakaoSDKLoaded) {
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        window.Kakao.API.request({
          url: '/v1/user/unlink',
          success: () => resolve(),
          fail: (error: any) => reject(error)
        });
      });
      
      await authService.unlinkSocialAccount(SocialAuthProvider.KAKAO as string);
      
      await authClient.logout();
    } catch (error) {
      console.error('카카오 연결 끊기 실패:', error);
      throw error;
    }
  }
}

const kakaoAuthProvider = new KakaoAuthProvider();

export default kakaoAuthProvider;

declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: { success: (authObj: any) => void; fail: (error: any) => void }) => void;
        logout: (callback: () => void) => void;
        getAccessToken: () => string | null;
      };
      API: {
        request: (options: { 
          url: string; 
          success: (response: any) => void; 
          fail: (error: any) => void 
        }) => void;
      };
    };
  }
}