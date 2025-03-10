// src/components/LoginModal.tsx
import React, { useState } from "react";
import Modal from "./Modal";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import useModal from "../../hooks/useModal";
import "../../style/LoginModal.css";
import { useNavigate } from "react-router-dom";

type TabType = "volunteer" | "organization";

const LoginModal: React.FC = () => {
  const { login } = useAuth();
  const { isOpen, open, close } = useModal();
  const [activeTab, setActiveTab] = useState<TabType>("volunteer");
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    close();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const goToVolunteerSignup = () => {
    close();
    navigate("/UsersSignup", {state: {fromLoginModal:true}});
  }

  const goToShelterSignup = () => {
    close();
    navigate("/ShelterSignup", { state: { fromLoginModal: true } });
  };

  return (
    <>
      <button className="open-modal-btn" onClick={open}>
        로그인 / 회원가입
      </button>

      <Modal isOpen={isOpen} onClose={close}>
        <div className="login-modal">
          <img src={logo} alt="펫모어핸즈 로고" className="logo" />
          <h2>반가워요!</h2>
          <p>펫모어핸즈에 오신 것을 환영합니다.</p>

          {/* 탭 메뉴 */}
          <div className="tab-container">
          <button 
              className={`tab ${activeTab === "volunteer" ? "active" : ""}`}
              onClick={() => handleTabChange("volunteer")}
            >
              봉사자
            </button>
            <button 
              className={`tab ${activeTab === "organization" ? "active" : ""}`}
              onClick={() => handleTabChange("organization")}
            >
              봉사기관
            </button>
          </div>

          {/* 탭 내용 - 조건부 렌더링 */}
          {activeTab === "volunteer" ? (
            <div className="tab-content">
              {/* 봉사자 로그인 폼 */}
              <label>이메일 입력</label>
              <input
                type="email"
                className="input-field"
                placeholder="이메일 입력"
              />

              <label>비밀번호 입력</label>
              <input
                type="password"
                className="input-field"
                placeholder="비밀번호 입력"
              />

              <div className="button-group">
                <button className="login-btn" onClick={handleLogin}>
                  로그인
                </button>
                <button className="signup-btn" onClick={goToVolunteerSignup}>회원가입 하기</button>
              </div>

              <button className="kakao-btn" onClick={handleLogin}>
                카카오톡으로 시작하기
              </button>
            </div>
          ) : (
            <div className="tab-content">
              {/* 봉사기관 로그인 폼 */}
              <label>기관 아이디</label>
              <input
                type="text"
                className="input-field"
                placeholder="기관 아이디 입력"
              />

              <label>비밀번호 입력</label>
              <input
                type="password"
                className="input-field"
                placeholder="비밀번호 입력"
              />

              <div className="button-group">
                <button className="login-btn" onClick={handleLogin}>
                  로그인
                </button>
                <button className="signup-btn" onClick={goToShelterSignup}>기관 회원가입</button>
              </div>
            </div>
          )}

          {/* 추가 링크 */}
          <div className="extra-links">
            <span>잊으셨나요?</span>
            <span>|</span>
            <span>아이디 찾기</span>
            <span>|</span>
            <span>비밀번호 재설정</span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;
