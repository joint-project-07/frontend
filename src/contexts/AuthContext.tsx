import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as apiLogin, 
  logout as apiLogout,
  UserInfo as ApiUserInfo,
  processKakaoLogin,
  updateProfile
} from '../api/userApi';
import { axiosInstance } from '../api/axios/axiosInstance';
import { UserRole, LoginCredentials } from '../types/auth-types';

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
  updateUserData: (userData: Partial<UserInfo>) => void;
  refreshUserToken: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KAKAO_REST_API_KEY = 'cbfe1b86b56a7e063d194679adf8c2c6';
const KAKAO_REDIRECT_URI = 'http://223.130.151.137/auth/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUserToken = async (): Promise<void> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (!storedRefreshToken) {
      return;
    }

    try {
      const response = await axiosInstance.post('/api/users/token/refresh/', {
        refresh_token: storedRefreshToken
      });
      
      const { access_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } catch (error) {
      console.error('토큰 재발급 오류:', error);
      await handleLogout();
    }
  };

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const kakaoCode = urlParams.get('code');
      
      if (kakaoCode && window.location.pathname === '/auth/kakao/callback') {
        setLoading(true);
        try {
          const kakaoTokenResponse = await fetch(`https://kauth.kakao.com/oauth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: KAKAO_REST_API_KEY,
              redirect_uri: KAKAO_REDIRECT_URI,
              code: kakaoCode,
            }),
          });

          const kakaoTokenData = await kakaoTokenResponse.json();
          
          if (kakaoTokenData.access_token) {
            const response = await processKakaoLogin({ access_token: kakaoTokenData.access_token });
            
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            const userData = response.data.user;
            
            if (userData) {
              const email = userData.email || '';
              
              const role = userData.role || UserRole.VOLUNTEER;
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
              localStorage.setItem('userType', 'volunteer'); 
              setUser(userInfo);
              setIsAuthenticated(true);
            }
            
            window.history.pushState({}, '', '/');
          }
        } catch (error) {
          console.error('카카오 로그인 콜백 처리 오류:', error);
          setError('카카오 로그인 처리 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleKakaoCallback();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedUser && accessToken && storedRefreshToken) {
        try {
          await refreshUserToken();
          
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('인증 확인 오류:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    checkAuth();
  }, []);

  const determineUserRole = (email: string | undefined): UserRole => {
    if (!email) {
      return UserRole.VOLUNTEER; 
    }
    
    return email.includes('@organization.com') 
      ? UserRole.ORGANIZATION 
      : UserRole.VOLUNTEER;
  };

const updateUserData = (userData: Partial<UserInfo>): void => {
  if (user) {
    console.log("업데이트 전 사용자 데이터:", user);
    console.log("업데이트할 데이터:", userData);
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    console.log("업데이트 후 사용자 데이터:", updatedUser);
    
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const mergedUser = { ...storedUser, ...userData };
    localStorage.setItem('user', JSON.stringify(mergedUser));
    
    if (userData.profile_image !== undefined) {
      console.log("프로필 이미지 동기화 수행:", userData.profile_image);
    }
    
    if (userData.name) {
      updateProfile({ name: userData.name }).catch(console.error);
    }
  } else {
    console.log("사용자 정보가 없어 업데이트할 수 없습니다.");
  }
};

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiLogin(credentials);
      
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      const userData = response.data.user;
      
      if (userData) {
        const email = userData.email || credentials.email || '';
        
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
      
      if (refreshToken) {
        await apiLogout({ refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType'); 
      
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loginWithKakao = async () => {
    window.location.href = KAKAO_AUTH_URL;
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
        updateUserData,
        refreshUserToken
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