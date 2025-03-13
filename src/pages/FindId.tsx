import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/FindId.module.scss';
import logo from "../assets/logo.png";

interface LocationState {
    openLoginModal: boolean;
    from: string;
  }
  

const FindId = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    
    if (digits.length <= 3) {
      formatted = digits;
    } else if (digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
    
    return formatted;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const sendVerification = () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (phoneNumber.replace(/[^0-9]/g, '').length !== 11) {
      setError('올바른 전화번호를 입력해주세요.');
      return;
    }

    setError('');
    setVerificationSent(true);
    
    // 실제 구현시:
    // try {
    //   const response = await api.sendVerification({
    //     name,
    //     phoneNumber
    //   });
    //   setVerificationSent(true);
    // } catch (error) {
    //   setError('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    // }
  };

  const verifyCode = () => {
    if (!verificationCode.trim()) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    setError('');
    setFoundId('example_user'); 
    setStep(2);
    
    // 실제 구현시:
    // try {
    //   const response = await api.verifyCode({
    //     name,
    //     phoneNumber,
    //     code: verificationCode
    //   });
    //   setFoundId(response.data.userId);
    //   setStep(2);
    // } catch (error) {
    //   setError('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
    // }
  };

  return (
    <div className={styles.findAccountContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="로고" className={styles.logoImage} />
      </div>
      
      <div className={styles.formContainer}>
        <h2>아이디 찾기</h2>
        
        {step === 1 ? (
          <div className={styles.stepContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="name">이름</label>
              <input 
                type="text" 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">휴대폰 번호</label>
              <div className={styles.verificationField}>
                <input 
                  type="tel" 
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="010-0000-0000"
                  className={styles.input}
                />
                <button 
                  onClick={sendVerification}
                  className={styles.verificationButton}
                  disabled={verificationSent}
                >
                  {verificationSent ? '재전송' : '인증번호 받기'}
                </button>
              </div>
            </div>
            
            {verificationSent && (
              <div className={styles.formGroup}>
                <label htmlFor="verificationCode">인증번호</label>
                <div className={styles.verificationField}>
                  <input 
                    type="text" 
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="인증번호 6자리 입력"
                    className={styles.input}
                  />
                  <button 
                    onClick={verifyCode}
                    className={styles.verificationButton}
                  >
                    확인
                  </button>
                </div>
                <p className={styles.verificationInfo}>
                  인증번호가 발송되었습니다. (유효시간 10분)
                </p>
              </div>
            )}
            
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        ) : (
          <div className={styles.resultContainer}>
            <div className={styles.successIcon}>
              <span>✓</span>
            </div>
            <h3>아이디 찾기 결과</h3>
            <p>회원님의 아이디는 <strong>{foundId}</strong> 입니다.</p>
            <div className={styles.buttonGroup}>
              <Link to="/login" className={styles.button}>
                로그인
              </Link>
              <Link to="/find-password" className={styles.secondaryButton}>
                비밀번호 찾기
              </Link>
            </div>
          </div>
        )}
        
        <div className={styles.linkContainer}>
            <span
                  onClick={() =>
                    navigate("/", {
                      state: {
                        openLoginModal: true,
                        from: "signup",
                      } as LocationState,
                    })
                  }
                  style={{ cursor: 'pointer' }}>
            로그인으로 돌아가기
            </span>
        </div>
      </div>
    </div>
  );
};

export default FindId;