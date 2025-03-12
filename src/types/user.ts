import { UserRole, SocialAuthProvider } from '../auth/types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSocialAccount {
  provider: SocialAuthProvider;
  socialId: string;
  connectedAt: string;
}

export interface UserDetail extends UserProfile {
  isEmailVerified: boolean;
  socialAccounts: UserSocialAccount[];
  lastLoginAt?: string;
}

export interface UserNotificationSettings {
  email: boolean;
  push: boolean;
  sms?: boolean;
}

export interface ActivityMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'LOGIN' | 'PROFILE_UPDATE' | 'PASSWORD_CHANGE' | 'SOCIAL_CONNECT' | 'SOCIAL_DISCONNECT' | string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: ActivityMetadata; 
  createdAt: string;
}

export interface UserProfileUpdateRequest {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
}