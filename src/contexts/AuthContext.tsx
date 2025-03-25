import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin, 
  logout as apiLogout,
  LoginCredentials,
  UserInfo as ApiUserInfo
} from '../api/userApi';
import { axiosInstance } from '../api/axios/axiosInstance';

export enum UserRole {
  VOLUNTEER = 'volunteer',
  ORGANIZATION = 'organization',
}

// 확장된 UserInfo 인터페이스
interface UserInfo extends ApiUserInfo {
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
  loginWithKakao: () => Promise<void>;
  updateUserData: (userData: UserInfo) => void; // 사용자 정보 업데이트 함수 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (storedUser && accessToken && refreshToken) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          // 잘못된 데이터가 있을 경우 로컬 스토리지 초기화
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    checkAuth();
  }, []);

  // 이메일로 사용자 역할 결정하는 헬퍼 함수 - undefined/null 체크 추가
  const determineUserRole = (email: string | undefined): UserRole => {
    // email이 undefined 또는 null인 경우 체크
    if (!email) {
      return UserRole.VOLUNTEER; // 기본값 반환
    }
    
    return email.includes('@organization.com') 
      ? UserRole.ORGANIZATION 
      : UserRole.VOLUNTEER;
  };

  // 사용자 정보를 컴포넌트에서 업데이트할 수 있는 함수
  const updateUserData = (userData: UserInfo): void => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiLogin(credentials);
      
      // accessToken과 refreshToken 설정
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // 백엔드에서 사용자 정보가 제공되는 경우
      const userData = response.data.user;
      
      if (userData) {
        // 기본값 설정
        const email = userData.email || credentials.email || '';
        
        // role 정보 추가
        const role = userData.role || determineUserRole(email);
        const userInfo: UserInfo = { 
          id: userData.id || 0,
          email: email,
          name: userData.name || '',
          contact_number: userData.contact_number || '',
          profile_image: userData.profile_image || null,
          role: role,
          ...userData
        };

        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }
  
      await apiLogout({ refresh_token: refreshToken });
      
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      // 로그아웃 시도 결과와 상관없이 항상 로컬 상태 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType'); // userType도 제거
      
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loginWithKakao = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axiosInstance.post('/api/users/kakao-login/');
      
      // accessToken과 refreshToken 설정
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // 백엔드에서 사용자 정보가 제공되는 경우
      const userData = response.data.user;
      
      if (userData) {
        // 기본값 설정
        const email = userData.email || '';
        
        // role 정보 추가
        const role = userData.role || UserRole.VOLUNTEER; // 카카오 로그인은 기본적으로 봉사자로 설정
        const userInfo: UserInfo = { 
          id: userData.id || 0,
          email: email,
          name: userData.name || '',
          contact_number: userData.contact_number || '',
          profile_image: userData.profile_image || null,
          role: role,
          ...userData
        };

        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('카카오 로그인 중 오류가 발생했습니다.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
        loading,
        error,
        isLoading: loading,
        loginWithKakao,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};