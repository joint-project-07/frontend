import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style/Header.module.scss";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { useModalContext } from "../../contexts/ModalContext";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { openLoginModal } = useModalContext();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  
  // userType 상태 추가
  const [userType, setUserType] = useState<string | null>(null);
  
  // 인증 상태가 변경되면 localStorage에서 userType 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      const storedUserType = localStorage.getItem('userType');
      setUserType(storedUserType);
      console.log("사용자 타입 로드됨:", storedUserType);
    } else {
      setUserType(null);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // 로그아웃 시 userType 제거
      localStorage.removeItem('userType');
      await logout();
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
        {isAuthenticated ? (
          <>
            {/* userType에 따라 다른 링크 표시 */}
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
          // 로그인되지 않은 경우 로그인 모달 버튼 표시
          <button className={styles.loginBtn} onClick={openLoginModal}>
            로그인 / 회원가입
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;