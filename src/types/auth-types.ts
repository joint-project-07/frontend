export enum UserRole {
    USER = 'user',
    VOLUNTEER = 'volunteer',
    ORGANIZATION = 'organization',
    ADMIN = 'admin'
  }
  
  export enum SocialAuthProvider {
    KAKAO = 'kakao',
    GOOGLE = 'google',
    NAVER = 'naver'
  }
  
  export interface AuthUser {
    id: string;
    name?: string;
    username?: string;
    email: string;
    role: UserRole;
    profileImage?: string;
    socialProvider?: SocialAuthProvider;
    socialId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    passwordConfirm?: string;
    name?: string;
    username?: string;
    role?: UserRole;
    [key: string]: any; 
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }
  
  export interface TokenRefreshResponse {
    accessToken: string;
  }
  
  export interface SocialAuthRequest {
    provider: SocialAuthProvider;
    token?: string;
    code?: string;
    redirectUri?: string;
  }
  
  export interface AuthError {
    message: string;
    code?: string;
  }