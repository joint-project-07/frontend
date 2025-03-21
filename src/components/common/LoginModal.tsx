import React, { useState } from "react";
import Modal from "./Modal";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../style/LoginModal.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useModalContext } from '../../contexts/ModalContext';

// 탭 타입 정의
type TabType = "volunteer" | "organization";

const LoginModal: React.FC = () => {
  const { login, isLoading, error, loginWithKakao } = useAuth();
  const { isLoginModalOpen, closeLoginModal, openLoginModal, activeTab, setActiveTab, previousPath, setPreviousPath } = useModalContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 폼 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizationPassword, setOrganizationPassword] = useState("");
  const [formError, setFormError] = useState("");

  // 모달이 열릴 때 현재 경로 저장
  React.useEffect(() => {
    if (isLoginModalOpen) {
      setPreviousPath(location.pathname);
    }
  }, [isLoginModalOpen, location.pathname, setPreviousPath]);

  const handleLogin = async () => {
    try {
      setFormError("");
      
      // 실제 환경에서는 이메일/비밀번호로 로그인
      if (activeTab === "volunteer") {
        if (!email || !password) {
          setFormError("이메일과 비밀번호를 모두 입력해주세요.");
          return;
        }
        await login({ email, password });
      } else {
        if (!organizationId || !organizationPassword) {
          setFormError("기관 아이디와 비밀번호를 모두 입력해주세요.");
          return;
        }
        await login({ 
          email: organizationId.includes('@') ? organizationId : `${organizationId}@organization.com`, 
          password: organizationPassword 
        });
      }
      
      // 사용자 타입 저장 (추가된 부분)
      localStorage.setItem('userType', activeTab);
      console.log(`로그인 성공: ${activeTab} 타입으로 저장됨`);
      
      closeLoginModal();

      // 이전 경로가 /detail로 시작하면 그 페이지에 머무름
      if (previousPath && previousPath.startsWith('/detail')) {
        // 단순히 모달을 닫고 현재 페이지에 머무름
        console.log("상세 페이지에 머무름");
      } else if (activeTab === "organization") {
        navigate("/institution-schedule");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setFormError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.");
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // 탭 변경 시 폼 상태 초기화
    setFormError("");
    setEmail("");
    setPassword("");
    setOrganizationId("");
    setOrganizationPassword("");
  };

  const goToVolunteerSignup = () => {
    closeLoginModal();
    navigate("/UsersSignup", {state: {fromLoginModal: true, prevPath: location.pathname}});
  }

  const goToShelterSignup = () => {
    closeLoginModal();
    navigate("/ShelterSignup", { state: { fromLoginModal: true, prevPath: location.pathname } });
  };

  // 아이디 찾기 페이지로 이동
  const goToFindId = () => {
    closeLoginModal();
    navigate("/find-id", { state: { prevPath: location.pathname } });
  };

  // 비밀번호 찾기 페이지로 이동
  const goToFindPassword = () => {
    closeLoginModal();
    navigate("/find-password", { state: { prevPath: location.pathname } });
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      setFormError("");
      await loginWithKakao();
      
      // 카카오 로그인은 기본적으로 volunteer로 설정
      localStorage.setItem('userType', 'volunteer');
      
      closeLoginModal();
      navigate("/");
    } catch (error) {
      console.error("카카오 로그인 중 오류 발생:", error);
      setFormError(error instanceof Error ? error.message : "카카오 로그인 중 오류가 발생했습니다.");
    }
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

          {formError && <p className={styles.errorText}>{formError}</p>}
          {error && <p className={styles.errorText}>{error}</p>}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>비밀번호 입력</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className={styles.buttonGroup}>
                <button 
                  className={styles.loginBtn} 
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
                <button className={styles.signupBtn} onClick={goToVolunteerSignup}>회원가입 하기</button>
              </div>

              <button 
                className={styles.kakaoBtn} 
                onClick={handleKakaoLogin}
                disabled={isLoading}
              >
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
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              />

              <label>비밀번호 입력</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="비밀번호 입력"
                value={organizationPassword}
                onChange={(e) => setOrganizationPassword(e.target.value)}
              />

              <div className={styles.buttonGroup}>
                <button 
                  className={styles.loginBtn} 
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
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