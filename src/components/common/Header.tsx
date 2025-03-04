import React from "react";
import "../../style/Header.css";
import Logo from "../../assets/logo.png";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img
          src={Logo}
          style={{ width: "200px", height: "100px" }}
          alt="Logo"
        />
      </div>
      <nav className="nav">
        <a href="/home">홈</a>
        <a href="/mypage">마이페이지</a>
        <a href="/volunteer-schedule">봉사 일정</a>
      </nav>
    </header>
  );
};

export default Header;
