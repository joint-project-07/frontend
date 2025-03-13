import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/FindPassward.module.scss';

interface LocationState {
    openLoginModal: boolean;
    from: string;
  }

const FindPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    number: false,
    letter: false,
    special: false
  });

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
    setContactNumber(formatted);
  };

  const validatePassword = (password: string) => {
    setPasswordValid({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      letter: /[a-zA-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
    
    return (
      password.length >= 8 &&
      /[0-9]/.test(password) &&
      /[a-zA-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const sendVerification = async () => {
    try {
      // 유효성 검사
      if (!email.trim()) {
        setError('이메일을 입력해주세요.');
        return;
      }

      if (contactNumber.replace(/[^0-9]/g, '').length !== 11) {
        setError('올바른 전화번호를 입력해주세요.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('올바른 이메일 주소를 입력해주세요.');
        return;
      }

      // API 요청 데이터 준비 - 이메일과 전화번호 모두 전송
      const requestData = { 
        email: email, 
        contact_number: contactNumber.replace(/[^0-9]/g, '')
      };

      // API 호출 (실제로는 API 경로를 정확히 지정해야 함)
      // const response = await axios.post('/api/find-password/send-verification', requestData);
      
      // 성공 처리 (테스트용 모의 처리)
      console.log('인증 요청 데이터:', requestData);
      setError('');
      setVerificationSent(true);
    } catch (error) {
      // 오류 처리
      console.error('인증번호 전송 오류:', error);
      setError('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const verifyCode = async () => {
    try {
      if (!verificationCode.trim()) {
        setError('인증번호를 입력해주세요.');
        return;
      }

      // API 요청 데이터 준비
      const requestData = {
        email: email,
        contact_number: contactNumber.replace(/[^0-9]/g, ''),
        verification_code: verificationCode
      };

      // API 호출 (실제로는 API 경로를 정확히 지정해야 함)
      // const response = await axios.post('/api/find-password/verify-code', requestData);
      
      // 성공 처리 (테스트용 모의 처리)
      console.log('인증 확인 데이터:', requestData);
      setError('');
      setStep(2);
    } catch (error) {
      // 오류 처리
      console.error('인증번호 확인 오류:', error);
      setError('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
    }
  };

  const resetPassword = async () => {
    try {
      if (!validatePassword(newPassword)) {
        setError('비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }

      // API 요청 데이터 준비
      const requestData = {
        email: email,
        contact_number: contactNumber.replace(/[^0-9]/g, ''),
        new_password: newPassword
      };

      // API 호출 (실제로는 API 경로를 정확히 지정해야 함)
      // const response = await axios.post('/api/find-password/reset', requestData);
      
      // 성공 처리 (테스트용 모의 처리)
      console.log('비밀번호 변경 데이터:', requestData);
      setError('');
      setStep(3);
    } catch (error) {
      // 오류 처리
      console.error('비밀번호 변경 오류:', error);
      setError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.findAccountContainer}>    
      <div className={styles.formContainer}>
        <h2>비밀번호 찾기</h2>
        
        {step === 1 && (
          <div className={styles.stepContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="contactNumber">휴대폰 번호</label>
              <div className={styles.verificationField}>
                <input 
                  type="tel" 
                  id="contactNumber"
                  value={contactNumber}
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
        )}
        
        {step === 2 && (
          <div className={styles.stepContainer}>
            <p className={styles.passwordResetInfo}>
              새로운 비밀번호를 입력해주세요.
            </p>
            
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">새 비밀번호</label>
              <input 
                type="password" 
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                placeholder="새 비밀번호"
                className={styles.input}
              />
              
              <div className={styles.passwordValidation}>
                <p className={passwordValid.length ? styles.valid : styles.invalid}>
                  ✓ 8자 이상
                </p>
                <p className={passwordValid.letter ? styles.valid : styles.invalid}>
                  ✓ 영문 포함
                </p>
                <p className={passwordValid.number ? styles.valid : styles.invalid}>
                  ✓ 숫자 포함
                </p>
                <p className={passwordValid.special ? styles.valid : styles.invalid}>
                  ✓ 특수문자 포함
                </p>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input 
                type="password" 
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
                className={styles.input}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className={styles.passwordMismatch}>
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
            
            {error && <p className={styles.errorMessage}>{error}</p>}
            
            <button 
              onClick={resetPassword}
              className={styles.button}
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              비밀번호 변경
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div className={styles.resultContainer}>
            <div className={styles.successIcon}>
              <span>✓</span>
            </div>
            <h3>비밀번호 변경 완료</h3>
            <p>비밀번호가 성공적으로 변경되었습니다.</p>
            <Link to="/login" className={styles.button}>
              로그인하기
            </Link>
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


export default FindPassword;