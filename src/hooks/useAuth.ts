import { useCallback, useEffect, useState } from 'react';
import { authClient, kakaoAuthProvider } from '../auth';
import { authService } from '../api/services';
import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials, 
  SocialAuthProvider 
} from '../auth/types';

const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(authClient.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authClient.isUserAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authClient.login(credentials);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authClient.register(userData);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '회원가입 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithKakao = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await kakaoAuthProvider.login();
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '카카오 로그인 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authClient.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUserInfo = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      const userData = await authClient.refreshUserInfo();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('사용자 정보 갱신 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const unlinkSocialAccount = useCallback(async (provider: SocialAuthProvider) => {
    setIsLoading(true);
    
    try {
      if (provider === SocialAuthProvider.KAKAO) {
        await kakaoAuthProvider.unlink();
      } else {
        await authService.unlinkSocialAccount(provider as string);
      }
      await refreshUserInfo();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '소셜 계정 연결 해제 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserInfo]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) {
        try {
          await refreshUserInfo();
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            logout();
          }
        }
      }
    };

    initAuth();
  }, [isAuthenticated, refreshUserInfo, logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    loginWithKakao,
    logout,
    refreshUserInfo,
    unlinkSocialAccount,
    requestPasswordReset
  };
};

export default useAuth;