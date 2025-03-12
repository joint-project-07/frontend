export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SHELTER_MANAGER = 'SHELTER_MANAGER',
}

export enum SocialAuthProvider {
  KAKAO = 'KAKAO'
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
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
  name: string;
  passwordConfirm?: string;
}

export interface SocialAuthRequest {
  accessToken: string;
  provider: SocialAuthProvider;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface TokenRefreshResponse {
  accessToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface JwtPayload {
  sub: string; 
  email: string;
  role: UserRole;
  iat: number; 
  exp: number; 
}

export interface SocialAuthConfig {
  provider: SocialAuthProvider;
  clientId: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
}

export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',
  SOCIAL_AUTH_FAILED = 'SOCIAL_AUTH_FAILED',
}