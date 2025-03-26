import React, { ReactNode, useEffect } from 'react';
import useAuthStore from './useauthStore'; 

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
    };
    
    verifyAuth();
  }, [checkAuthStatus]);

  return <>{children}</>;
};

export default AuthProvider;