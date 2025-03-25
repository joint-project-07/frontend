import { AuthUser, UserRole, SocialAuthProvider } from '../auth/types';

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

export interface PermissionCheck {
  hasPermission: boolean;
  requiredRole: UserRole;
  currentRole: UserRole | null;
}