// src/types/kakao.d.ts

// Kakao 인증 객체 타입
interface KakaoAuthObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  token_type: string;
  scope?: string;
}

// Kakao 에러 객체 타입
interface KakaoError {
  error: string;
  error_description?: string;
  status?: number;
}

// Kakao 상태 정보 타입
interface KakaoStatusInfo {
  status: 'connected' | 'not_connected';
  user?: {
    id: number;
    kakao_account?: {
      email?: string;
      profile?: {
        nickname?: string;
        profile_image_url?: string;
      }
    }
  }
}

// Kakao API 응답 타입
interface KakaoApiResponse {
  [key: string]: unknown;
}

interface KakaoSDK {
    init(appKey: string): boolean;
    isInitialized(): boolean;
    Auth: {
      login(options: {
        success: (authObj: KakaoAuthObj) => void;
        fail: (error: KakaoError) => void;
        scope?: string;
      }): void;
      logout(callback?: () => void): void;
      getAccessToken(): string | null;
      getStatusInfo(callback: (statusObj: KakaoStatusInfo) => void): void;
    };
    API: {
      request(options: {
        url: string;
        success: (response: KakaoApiResponse) => void;
        fail: (error: KakaoError) => void;
        data?: Record<string, unknown>;
      }): void;
    };
  }
  
  // Window 인터페이스에 Kakao 속성을 추가합니다
  declare global {
    interface Window {
      Kakao: KakaoSDK;
    }
  }
  
  // TypeScript 모듈로 만들기 위한 export 문
  export {};