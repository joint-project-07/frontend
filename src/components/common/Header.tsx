import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style/Header.module.scss";
import Logo from "../../assets/logo.png";
import LoginModal from "./LoginModal";
import { useAuth, UserRole } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  // useAuth 훅에서 필요한 값들 가져오기
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  // 디버깅을 위한 로그 추가
  React.useEffect(() => {
    console.log('Header 컴포넌트 - 인증 상태:', isAuthenticated);
    console.log('Header 컴포넌트 - 현재 사용자:', user);
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  // user가 null일 수 있으므로 안전하게 역할 확인
  const userRole = user?.role || null;

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to={userRole === UserRole.ORGANIZATION ? "/institution-schedule" : "/"}>
          <img
            src={Logo}
            style={{ width: "150px", height: "75px" }}
            alt="Logo"
          />
        </Link>
      </div>

      <nav className={styles.nav}>
        {isAuthenticated && user ? (
          <>
            {userRole === UserRole.VOLUNTEER ? (
              <Link to="/MyPage">마이페이지</Link>
            ) : userRole === UserRole.ORGANIZATION ? (
              <Link to="/schedule-registration">봉사 일정 등록</Link>
            ) : null}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <LoginModal />
        )}
      </nav>
    </header>
  );
};

export default Header;