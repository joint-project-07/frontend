// src/types/kakao.d.ts

interface KakaoSDK {
    init(appKey: string): boolean;
    isInitialized(): boolean;
    Auth: {
      login(options: {
        success: (authObj: any) => void;
        fail: (error: any) => void;
        scope?: string;
      }): void;
      logout(callback?: () => void): void;
      getAccessToken(): string | null;
      getStatusInfo(callback: (statusObj: any) => void): void;
    };
    API: {
      request(options: {
        url: string;
        success: (response: any) => void;
        fail: (error: any) => void;
        data?: any;
      }): void;
    };
  }
  
  // 이 부분이 중요합니다! Window 인터페이스에 Kakao 속성을 추가합니다.
  declare global {
    interface Window {
      Kakao: KakaoSDK;
    }
  }
  
  // TypeScript 모듈로 만들기 위한 export 문
  export {};