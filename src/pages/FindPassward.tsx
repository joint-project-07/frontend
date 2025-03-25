import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/FindPassward.module.scss';
import { resetPassword } from '../api/userApi';

interface LocationState {
  openLoginModal: boolean;
  from: string;
}

const FindPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setContactNumber(formatted);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    if (contactNumber.replace(/[^0-9]/g, '').length !== 11) {
      setError('올바른 전화번호를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const requestData = { 
        email: email, 
        contact_number: contactNumber.replace(/[^0-9]/g, '')
      };

      const response = await resetPassword(requestData);
      if (response.status === 200) {
        setStep(2);
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('임시 비밀번호 발급에 실패했습니다. 입력한 정보를 확인해주세요.');
      }
    } finally {
      setLoading(false);
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
                disabled={loading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="contactNumber">휴대폰 번호</label>
              <input 
                type="tel" 
                id="contactNumber"
                value={contactNumber}
                onChange={handlePhoneNumberChange}
                placeholder="010-0000-0000"
                className={styles.input}
                disabled={loading}
              />
            </div>
            
            <button 
              onClick={handleResetPassword}
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '처리 중...' : '임시 비밀번호 발급'}
            </button>
            
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        )}
        
        {step === 2 && (
          <div className={styles.resultContainer}>
            <div className={styles.successIcon}>
              <span>✓</span>
            </div>
            <h3>임시 비밀번호 발송 완료</h3>
            <p>
              임시 비밀번호가 이메일({email})로 발송되었습니다.<br />
              로그인 후 마이페이지에서 비밀번호를 변경해 주세요.
            </p>
          </div>
        )}
        
        <div className={styles.button}>
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