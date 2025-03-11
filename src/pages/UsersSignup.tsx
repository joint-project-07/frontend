import { Link, useNavigate } from "react-router-dom";
import { useUsersStore } from "../store/UsersStore";
import styles from "../style/UsersSignupForm.module.scss";
import { useState } from "react";
import logoImage from "../assets/logo.png"; 
import TermsAgreement from "../components/common/TermsAgreement";

interface LocationState {
  openLoginModal: boolean;
  from: string;
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.agree_terms || !form.agree_privacy) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    alert("회원가입 완료!");
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <div className={styles.logoContainer}
        onClick={() => navigate("/")} 
        style={{ cursor: 'pointer' }}>
          <img src={logoImage} alt="로고" className={styles.logoImage} />
        </div>
        <h2>회원가입</h2>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>이메일 <span className={styles.required}>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={form.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
            <label>비밀번호 <span className={styles.required}>*</span></label>
            <div className={styles.passwordContainer}>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해 주세요. (8자리 이상)"
                value={form.password || ""}
                onChange={handleChange}
                className={`${styles.passwordInput} ${!passwordMatch && passwordConfirm !== "" ? styles.passwordError : ""}`}
                minLength={8}
                required
              />
              <div className={styles.passwordConfirmWrapper}>
                <input
                  type="password"
                  name="password_confirm"
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  className={`${styles.passwordConfirmInput} ${!passwordMatch ? styles.passwordError : ""}`}
                  required
                />
              </div>
            </div>
            {!passwordMatch && passwordConfirm !== "" && (
              <p className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>이름 <span className={styles.required}>*</span></label>
            <input
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
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
          
          <div className={styles.termsContainer}>
            <p className={styles.termsTitle}>이용약관 동의</p>
            
            <TermsAgreement
              agreements={[
                {
                  name: 'agree_terms',
                  label: '이용약관 동의',
                  required: true,
                  link: '#'
                },
                {
                  name: 'agree_privacy',
                  label: '개인정보 수집 및 이용 동의',
                  required: true,
                  link: '#'
                },
                {
                  name: 'agree_marketing',
                  label: '마케팅 정보 수신 동의',
                  required: false
                }
              ]}
              initialValues={{
                agree_all: form.agree_all || false,
                agree_terms: form.agree_terms || false,
                agree_privacy: form.agree_privacy || false,
                agree_marketing: form.agree_marketing || false
              }}
              onAgreementChange={(newState) => {
                Object.entries(newState).forEach(([key, value]) => {
                  setForm({ [key]: value });
                });
              }}
            />
          </div>
          
          <button type="submit">회원가입 완료</button>
        </form>
        <div className={styles.organizationLink}>
          <Link to="/ShelterSignup" className={styles.orgSignupLink}>
            기관 이신가요? 기관 회원가입
          </Link>
        </div>
        <div 
          className={styles.backLink} 
          onClick={() => navigate("/", { 
            state: { 
              openLoginModal: true,
              from: 'signup'
            } as LocationState
          })}
        >
          이미 계정이 있으신가요? 로그인하기
        </div>
      </div>
    </div>
  );
};

export default UsersSignupForm;