import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

// UserRole 타입을 string 타입의 리터럴 유니온으로 정의
export type UserRole = 'volunteer' | 'organization' | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'volunteer' || savedRole === 'organization') {
      return savedRole;
    }
    return null;
  });
  
  const login = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    if (role) {
      localStorage.setItem('userRole', role);
    }
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};