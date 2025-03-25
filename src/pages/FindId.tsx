import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/FindId.module.scss';
import logo from "../assets/logo.png";
import { findEmail } from '../api/userApi';

interface LocationState {
  openLoginModal: boolean;
  from: string;
}

const FindId = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundId, setFoundId] = useState('');
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
    setPhoneNumber(formatted);
  };

  const handleFindEmail = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhoneNumber.length !== 11) {
      setError('올바른 전화번호를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // 이메일 찾기 API 호출
      const response = await findEmail({
        name: name,
        contact_number: cleanPhoneNumber
      });
      
      setFoundId(response.data.email);
      setStep(2);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('이메일을 찾을 수 없습니다. 입력한 정보를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">휴대폰 번호</label>
              <input 
                type="tel" 
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="010-0000-0000"
                className={styles.input}
                disabled={loading}
              />
            </div>
            
            <button 
              onClick={handleFindEmail}
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '처리 중...' : '아이디 찾기'}
            </button>
            
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