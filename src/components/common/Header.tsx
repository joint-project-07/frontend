import React from "react";
import { Link } from "react-router-dom";
import styles from "../../style/Header.module.scss";
import Logo from "../../assets/logo.png";
import LoginModal from "./LoginModal";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

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
          // 로그인된 경우 표시할 메뉴
          <>
            <Link to="/MyPage">마이페이지</Link>
            <button className={styles.logoutBtn} onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          // 로그인되지 않은 경우 표시할 메뉴
          <LoginModal />
        )}
      </nav>
    </header>
  );
};

export default Header;