import { Link, useNavigate } from "react-router-dom";
import { useUsersStore } from "../store/UsersStore";
import "../style/UsersSignupForm.css";
import { useState } from "react";
import logoImage from "../assets/logo.png"; 

const UsersSignupForm: React.FC = () => {
  const { form, setForm } = useUsersStore();
  const [passwordConfirm, setPasswordConfirm] = useState(form.password_confirm || "");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ [name]: value });
    
    // 비밀번호가 변경되었을 때 확인 비밀번호와 일치 여부 업데이트
    if (name === "password") {
      setPasswordMatch(passwordConfirm === "" || passwordConfirm === value);
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    setForm({ password_confirm: value });
    setPasswordMatch(value === form.password);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm({ [name]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.agree_all) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    alert("회원가입 완료!");
    console.log("회원정보:", form);
  };

  return (
    <div className="signup-page">
      <div className="logo-container">
        <img src={logoImage} alt="로고" className="logo-image" />
      </div>
      
      <div className="signup-container">
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일 <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={form.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group password-group">
            <label>비밀번호 <span className="required">*</span></label>
            <div className="password-container">
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해 주세요. (8자리 이상)"
                value={form.password || ""}
                onChange={handleChange}
                className={`password-input ${!passwordMatch && passwordConfirm !== "" ? "password-error" : ""}`}
                minLength={8}
                required
              />
              <div className="password-confirm-wrapper">
                <input
                  type="password"
                  name="password_confirm"
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  className={`password-confirm-input ${!passwordMatch ? "password-error" : ""}`}
                  required
                />
              </div>
            </div>
            {!passwordMatch && passwordConfirm !== "" && (
              <p className="error-message">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          
          <div className="form-group">
            <label>이름 <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>전화번호 </label>
            <input
              type="tel"
              name="phone_number"
              placeholder="'-' 없이 숫자만 입력하세요"
              value={form.phone_number || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* 이용약관 동의 섹션 */}
          <div className="terms-container">
            <p className="terms-title">이용약관 동의</p>
            
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agree_all"
                name="agree_all"
                checked={form.agree_all || false}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="agree_all">
                전체 동의합니다
              </label>
            </div>
            
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agree_terms"
                name="agree_terms"
                checked={form.agree_terms || false}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="agree_terms">
                (필수) 이용약관 동의
                <a href="#" className="terms-link">보기</a>
              </label>
            </div>
            
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agree_privacy"
                name="agree_privacy"
                checked={form.agree_privacy || false}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="agree_privacy">
                (필수) 개인정보 수집 및 이용 동의
                <a href="#" className="terms-link">보기</a>
              </label>
            </div>
            
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agree_marketing"
                name="agree_marketing"
                checked={form.agree_marketing || false}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="agree_marketing">
                (선택) 마케팅 정보 수신 동의
              </label>
            </div>
          </div>
          
          <button type="submit">회원가입 완료</button>
        </form>
        <div className="organization-link">
            <Link to="/ShelterSignup" className="org-signup-link">
              기관 이신가요? 기관 회원가입
            </Link>
          </div>
          <div 
      className="back-link" 
      onClick={() => navigate("/", { 
        state: { openLoginModal: true } as { openLoginModal: boolean }
      })}
    >
      이미 계정이 있으신가요? 로그인하기
    </div>

      </div>
    </div>
  );
};

export default UsersSignupForm;