import React from "react";
import { Link } from "react-router-dom";
import styles from "../../style/Header.module.scss";
import Logo from "../../assets/logo.png";
import LoginModal from "./LoginModal";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { isLoggedIn, logout, userRole } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img
            src={Logo}
            style={{ width: "150px", height: "75px" }}
            alt="Logo"
          />
        </Link>
      </div>

      <nav className={styles.nav}>
        {isLoggedIn ? (
          <>
            {userRole === "volunteer" ? (
              <Link to="/MyPage">마이페이지</Link>
            ) : userRole === "organization" ? (
              <Link to="/schedule-registration">봉사 일정 등록</Link>
            ) : null}
            <button className={styles.logoutBtn} onClick={logout}>
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