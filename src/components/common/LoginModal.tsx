import React from "react";
import Modal from "./Modal";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../style/LoginModal.module.scss";
import { useNavigate } from "react-router-dom";
import { useModalContext } from '../../contexts/ModalContext';
import { UserRole } from "../../contexts/AuthContext"; // UserRole 타입 임포트

// TabType을 UserRole과 동일하게 정의
type TabType = "volunteer" | "organization";

const LoginModal: React.FC = () => {
  const { login } = useAuth();
  const { isLoginModalOpen, closeLoginModal, openLoginModal, activeTab, setActiveTab } = useModalContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // activeTab을 UserRole 타입으로 명시적 형변환
      login(activeTab as UserRole);
      closeLoginModal();

      if (activeTab === "organization") {
        navigate("/institution-schedule");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      // 에러 처리 로직 추가
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const goToVolunteerSignup = () => {
    closeLoginModal();
    navigate("/UsersSignup", {state: {fromLoginModal:true}});
  }

  const goToShelterSignup = () => {
    closeLoginModal();
    navigate("/ShelterSignup", { state: { fromLoginModal: true } });
  };

  // 아이디 찾기 페이지로 이동
  const goToFindId = () => {
    closeLoginModal();
    navigate("/find-id");
  };

  // 비밀번호 찾기 페이지로 이동
  const goToFindPassword = () => {
    closeLoginModal();
    navigate("/find-password");
  };

  return (
    <>
      <button className={styles.openModalBtn} onClick={openLoginModal}>
        로그인 / 회원가입
      </button>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <div className={styles.loginModal}>
          <img src={logo} alt="펫모어핸즈 로고" className={styles.logo} />
          <h2>반가워요!</h2>
          <p>펫모어핸즈에 오신 것을 환영합니다.</p>

          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tab} ${activeTab === "volunteer" ? styles.active : ""}`}
              onClick={() => handleTabChange("volunteer")}
            >
              봉사자
            </button>
            <button 
              className={`${styles.tab} ${activeTab === "organization" ? styles.active : ""}`}
              onClick={() => handleTabChange("organization")}
            >
              봉사기관
            </button>
          </div>

          {activeTab === "volunteer" ? (
            <div className={styles.tabContent}>
              <label>이메일 입력</label>
              <input
                type="email"
                className={styles.inputField}
                placeholder="이메일 입력"
              />

              <label>비밀번호 입력</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="비밀번호 입력"
              />

              <div className={styles.buttonGroup}>
                <button className={styles.loginBtn} onClick={handleLogin}>
                  로그인
                </button>
                <button className={styles.signupBtn} onClick={goToVolunteerSignup}>회원가입 하기</button>
              </div>

              <button className={styles.kakaoBtn} onClick={handleLogin}>
                카카오톡으로 시작하기
              </button>
            </div>
          ) : (
            <div className={styles.tabContent}>
              <label>기관 아이디</label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="기관 아이디 입력"
              />

              <label>비밀번호 입력</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="비밀번호 입력"
              />

              <div className={styles.buttonGroup}>
                <button className={styles.loginBtn} onClick={handleLogin}>
                  로그인
                </button>
                <button className={styles.signupBtn} onClick={goToShelterSignup}>기관 회원가입</button>
              </div>
            </div>
          )}

          <div className={styles.extraLinks}>
            <span>잊으셨나요?</span>
            <span>|</span>
            <span onClick={goToFindId} className={styles.linkText}>아이디 찾기</span>
            <span>|</span>
            <span onClick={goToFindPassword} className={styles.linkText}>비밀번호 재설정</span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;