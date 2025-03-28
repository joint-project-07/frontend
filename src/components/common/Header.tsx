import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style/Header.module.scss";
import Logo from "../../assets/logo.png";
import useAuthStore from "../../store/auth/useauthStore";
import { useModalContext } from "../../contexts/ModalContext";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore(); 
  const { openLoginModal } = useModalContext();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const [localAuth, setLocalAuth] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
      setLocalAuth(!!token);
    };
    
    checkAuth();
    
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const isActuallyAuthenticated = isAuthenticated || localAuth;
  
  const userType = localStorage.getItem('userType');

  if (process.env.NODE_ENV === 'development') {
    console.log("Header 렌더링 - 인증 상태:", isActuallyAuthenticated, "사용자 타입:", userType);
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      console.log("로그아웃 시작");
      
      await logout();
      
      setLocalAuth(false);
      
      console.log("로그아웃 완료, 홈으로 이동");
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to={userType === "organization" ? "/institution-schedule" : "/"}>
          <img
            src={Logo}
            style={{ width: "150px", height: "75px" }}
            alt="Logo"
          />
        </Link>
      </div>

      <nav className={styles.nav}>
        {isActuallyAuthenticated ? (
          <>
            {userType === "volunteer" && (
              <Link to="/MyPage" className={styles.navLink}>마이페이지</Link>
            )}
            {userType === "organization" && (
              <Link to="/schedule-registration" className={styles.navLink}>봉사 일정 등록</Link>
            )}
            <button 
              className={styles.logoutBtn} 
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <button className={styles.loginBtn} onClick={openLoginModal}>
            로그인 / 회원가입
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;