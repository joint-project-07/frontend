import React, { useState } from "react";
import Modal from "./Modal";
import logo from "../../assets/logo.png";

const LoginModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
        로그인 / 회원가입
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="login-modal">
          <img src={logo} alt="펫모어핸즈 로고" className="logo" />
          <h2>반가워요!</h2>
          <p>펫모어핸즈에 오신 것을 환영합니다.</p>

          {/* 탭 메뉴 */}
          <div className="tab-container">
            <button className="tab active">봉사자</button>
            <button className="tab">봉사기관</button>
          </div>

          {/* 이메일 입력 */}
          <label>이메일 입력</label>
          <input
            type="email"
            className="input-field"
            placeholder="이메일 입력"
          />

          {/* 비밀번호 입력 */}
          <label>비밀번호 입력</label>
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호 입력"
          />

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button className="login-btn">로그인</button>
            <button className="signup-btn">회원가입 하기</button>
          </div>

          {/* 카카오 로그인 */}
          <button className="kakao-btn">카카오톡으로 시작하기</button>

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
