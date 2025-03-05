import React from "react";
import { Link } from "react-router-dom";
import "../../style/Header.css";
import Logo from "../../assets/logo.png";

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
        <Link to="/volunteer-schedule">봉사 일정</Link>
      </nav>
    </header>
  );
};

export default Header;
