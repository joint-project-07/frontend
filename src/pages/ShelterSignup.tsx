import { Link, useNavigate } from "react-router-dom";
import { useShelterStore } from "../store/ShelterStore";
import styles from "../style/ShelterSignup.module.scss";
import { useState } from "react";
import logoImage from "../assets/logo.png";
import TermsAgreement from "../components/common/TermsAgreement";
import {
  checkDuplicateEmail,
  requestVerificationCode,
  verifyCode,
  shelterSignup,
} from "../api/services/shelterApi";

interface LocationState {
  openLoginModal: boolean;
  from: string;
  activeTab?: string;
}

const ShelterSignupForm: React.FC = () => {
  const { form, setForm } = useShelterStore();
  const [passwordConfirm, setPasswordConfirm] = useState(
    form.password_confirm || ""
  );
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null); // true: 사용 가능, false: 중복
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력할 인증 코드
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ [name]: value });

    if (name === "business_registration_email") {
      setEmailChecked(false); // 이메일 변경 시 중복 확인 초기화
      setEmailValid(null);
      setCodeSent(false);
      setCodeVerified(false);
    }

    // 비밀번호가 변경되었을 때 확인 비밀번호와 일치 여부 업데이트
    if (name === "password") {
      setPasswordMatch(passwordConfirm === "" || passwordConfirm === value);
    }
  };

  const handleCheckDuplicateEmail = async () => {
    if (!form.business_registration_email) {
      alert("이메일을 입력하세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await checkDuplicateEmail(
        form.business_registration_email
      );
      setEmailValid(!response.exists);
      setEmailChecked(true);
    } catch (err) {
      console.error("이메일 중복 확인 에러:", err);
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerificationCode = async () => {
    if (!form.business_registration_email || !emailValid) {
      alert("사용 가능한 이메일을 입력한 후 다시 시도하세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await requestVerificationCode(
        form.business_registration_email
      );
      console.log("인증 코드 요청 응답:", response);

      setCodeSent(true);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } catch {
      alert("인증 코드 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert("인증 코드를 입력하세요.");
      return;
    }

    try {
      const response = await verifyCode(
        form.business_registration_email,
        verificationCode
      );
      if (response.status === 200) {
        setCodeVerified(true);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        alert("인증 코드가 올바르지 않습니다.");
      }
    } catch (err) {
      alert("인증 코드 검증 중 오류가 발생했습니다.");
    }
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    setForm({ password_confirm: value });
    setPasswordMatch(value === form.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailChecked || emailValid === false) {
      alert("이메일 중복 확인을 완료해주세요.");
      return;
    }

    if (!codeVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (form.password !== form.password_confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.agree_terms || !form.agree_privacy) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    const signupData = {
      ...form,
      email: form.business_registration_email, // 추가
    };

    try {
      await shelterSignup(signupData);
      alert("보호소 회원가입 완료!");
      navigate("/login");
    } catch (err) {
      const errorResponse = err as { response?: { data?: { email?: string[] } } };
      console.error("회원가입 에러:", errorResponse?.response?.data || err);
      alert(
        errorResponse?.response?.data?.email?.[0] || "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.signupContainer}>
        <div
          className={styles.logoContainer}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logoImage} alt="로고" className={styles.logoImage} />
        </div>
        <h2>보호소 회원가입</h2>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>
              보호소 이름 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="보호소 이름"
              value={form.name || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              사업자등록 메일 <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="business_registration_email"
              placeholder="사업자등록 메일"
              value={form.business_registration_email || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <button
              type="button"
              className={styles.checkButton}
              onClick={handleCheckDuplicateEmail}
              disabled={loading}
            >
              {loading ? "확인 중..." : "중복 확인"}
            </button>
            {emailChecked && (
              <p
                className={
                  emailValid ? styles.validMessage : styles.errorMessage
                }
              >
                {emailValid
                  ? "사용 가능한 이메일입니다."
                  : "이미 사용 중인 이메일입니다."}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <button type="button" onClick={handleRequestVerificationCode}>
              인증 코드 요청
            </button>
          </div>

          {codeSent && (
            <div className={styles.formGroup}>
              <label>인증 코드 입력</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증 코드를 입력하세요"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={codeVerified || verificationCode.length < 4}
              >
                {codeVerified ? "인증 완료" : "인증 확인"}
              </button>
            </div>
          )}

          {codeVerified && (
            <div className={styles.formGroup}>
              <button type="button" disabled className={styles.verifiedButton}>
                이메일 인증 완료
              </button>
            </div>
          )}

          <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
            <label>
              비밀번호 <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordContainer}>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해 주세요. (8자리 이상)"
                value={form.password || ""}
                onChange={handleChange}
                className={`${styles.passwordInput} ${
                  !passwordMatch && passwordConfirm !== ""
                    ? styles.passwordError
                    : ""
                }`}
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
                  className={`${styles.passwordConfirmInput} ${
                    !passwordMatch ? styles.passwordError : ""
                  }`}
                  required
                />
              </div>
            </div>
            {!passwordMatch && passwordConfirm !== "" && (
              <p className={styles.errorMessage}>
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>
              보호소 유형 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="shelter_type"
              placeholder="보호소 유형"
              value={form.shelter_type || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              사업자 등록번호 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="business_registration_number"
              placeholder="사업자 등록번호"
              value={form.business_registration_number || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              보호소 주소 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="보호소 주소"
              value={form.address || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              대표자 명 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="owner_name"
              placeholder="대표자 명"
              value={form.owner_name || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              보호소 연락처 <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="contact_number"
              placeholder="'-' 없이 숫자만 입력하세요"
              value={form.contact_number || ""}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.termsContainer}>
            <p className={styles.termsTitle}>이용약관 동의</p>

            <TermsAgreement
              agreements={[
                {
                  name: "agree_terms",
                  label: "이용약관 동의",
                  required: true,
                  link: "#",
                },
                {
                  name: "agree_privacy",
                  label: "개인정보 수집 및 이용 동의",
                  required: true,
                  link: "#",
                },
                {
                  name: "agree_marketing",
                  label: "마케팅 정보 수신 동의",
                  required: false,
                },
              ]}
              initialValues={{
                agree_all: form.agree_all || false,
                agree_terms: form.agree_terms || false,
                agree_privacy: form.agree_privacy || false,
                agree_marketing: form.agree_marketing || false,
              }}
              onAgreementChange={(newState) => {
                Object.entries(newState).forEach(([key, value]) => {
                  setForm({ [key]: value });
                });
              }}
            />
          </div>

          <button type="submit" className={styles.button}>
            회원가입 완료
          </button>
        </form>

        <div className={styles.userLink}>
          봉사자 이신가요?{" "}
          <Link to="/UsersSignup" className={styles.orgSignupLink}>
            일반 회원가입
          </Link>
        </div>

        <div
          className={styles.backLink}
          onClick={() =>
            navigate("/", {
              state: {
                openLoginModal: true,
                from: "signup",
                activeTab: "organization",
              } as LocationState,
            })
          }
        >
          이미 계정이 있으신가요? 로그인하기
        </div>
      </div>
    </div>
  );
};

export default ShelterSignupForm;