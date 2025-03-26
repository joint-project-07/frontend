import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../style/Header.module.scss";
import Logo from "../../assets/logo.png";
import useAuthStore from "../../store/auth/useauthStore";
import { useModalContext } from "../../contexts/ModalContext";

const Header: React.FC = () => {
  // 앱에서 사용하는 인증 방식에 맞게 선택하세요
  const { isAuthenticated, logout } = useAuthStore(); 
  const { openLoginModal } = useModalContext();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  
  // 강제 리렌더링을 위한 상태 추가
  const [, forceUpdate] = useState({});
  
  // 카카오 로그인 후 강제 리렌더링을 위한 효과
  useEffect(() => {
    // 주기적으로 인증 상태 확인
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
      if (token) {
        // 강제 리렌더링
        forceUpdate({});
      }
    };
    
    // 처음 로드 시 확인
    checkAuth();
    
    // 주기적으로 확인 (선택적)
    const interval = setInterval(checkAuth, 1000); // 1초마다 확인
    
    return () => clearInterval(interval);
  }, []);
  
  // 실제 인증 상태와 로컬 스토리지의 토큰을 모두 확인
  const isActuallyAuthenticated = isAuthenticated || 
    !!(localStorage.getItem('accessToken') || localStorage.getItem('access_token'));
  
  // userType 결정
  const userType = localStorage.getItem('userType');

  // 중요: 콘솔에 현재 상태 로깅
  console.log("Header 렌더링 - 인증 상태:", isActuallyAuthenticated, "사용자 타입:", userType);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      console.log("로그아웃 시작");
      
      // useAuthStore의 logout 함수 호출
      await logout();
      
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