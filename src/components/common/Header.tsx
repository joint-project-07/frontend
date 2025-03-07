// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../../style/Header.css";
import Logo from "../../assets/logo.png";
import LoginModal from "./LoginModal";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img
            src={Logo}
            style={{ width: "150px", height: "75px" }}
            alt="Logo"
          />
        </Link>
      </div>

      <nav className="nav">
        {isLoggedIn ? (
          // 로그인된 경우 표시할 메뉴
          <>
            <Link to="/MyPage">마이페이지</Link>
            <Link to="/institution/:institutionId">test</Link>
            <Link to="/volunteer-schedule">test2</Link>
            <button className="logout-btn" onClick={logout}>
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
