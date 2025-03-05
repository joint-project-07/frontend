import React from "react";
import { Link } from "react-router-dom";
import "../../style/Header.css";
import Logo from "../../assets/logo.png";
import LoginModal from "./LoginModal";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img
            src={Logo}
            style={{ width: "200px", height: "100px" }}
            alt="Logo"
          />
        </Link>
      </div>
      <nav className="nav">
        <Link to="/">홈</Link>
        <Link to="/MyPage">마이페이지</Link>
        <button onClick={LoginModal}>로그인</button>
      </nav>
    </header>
  );
};

export default Header;
