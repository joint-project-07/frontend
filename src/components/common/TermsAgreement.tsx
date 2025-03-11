import React, { useState, useEffect } from 'react';
import TermsModal from './TermsModal';
import { TermsOfServiceContent, PrivacyPolicyContent, MarketingConsentContent } from './TermsContent';
import styles from '../../style/TermsModal.module.scss';

interface AgreementItem {
  name: string;
  label: string;
  required: boolean;
  link?: string;
}

interface AgreementState {
  agree_all: boolean;
  [key: string]: boolean;
}

interface TermsAgreementProps {
  agreements: AgreementItem[];
  onAgreementChange?: (agreements: AgreementState) => void;
  initialValues?: Partial<Record<string, boolean>>;
  showLinks?: boolean;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({ 
  agreements, 
  onAgreementChange, 
  initialValues = {}, 
  showLinks = true 
}) => {
  const [agreementState, setAgreementState] = useState<AgreementState>(() => {
    const baseState: AgreementState = {
      agree_all: false
    };
    
    agreements.forEach(item => {
      baseState[item.name] = false;
    });
    
    if (initialValues) {
      Object.keys(initialValues).forEach(key => {
        if (key === 'agree_all' || agreements.some(item => item.name === key)) {
          baseState[key] = !!initialValues[key];
        }
      });
    }
    
    return baseState;
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  
  const handleAgreeAll = () => {
    const newChecked = !agreementState.agree_all;
    const newState: AgreementState = { 
      ...agreementState, 
      agree_all: newChecked 
    };
    
    agreements.forEach(item => {
      newState[item.name] = newChecked;
    });
    
    setAgreementState(newState);
    
    if (onAgreementChange) {
      onAgreementChange(newState);
    }
  };
  
  const handleAgreementChange = (name: string) => {
    const newChecked = !agreementState[name];
    const newState: AgreementState = { 
      ...agreementState, 
      [name]: newChecked 
    };
    
    // 모든 약관에 동의했는지 확인
    const allAgreed = agreements.every(agreement => 
      agreement.name === name ? newChecked : newState[agreement.name]
    );
    newState.agree_all = allAgreed;
    
    setAgreementState(newState);
    
    if (onAgreementChange) {
      onAgreementChange(newState);
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    
    if (name === 'agree_all') {
      handleAgreeAll();
    } else {
      handleAgreementChange(name);
    }
  };
  
  useEffect(() => {
    const newState = { ...agreementState };
    let stateChanged = false;
    
    agreements.forEach(item => {
      if (newState[item.name] === undefined) {
        newState[item.name] = false;
        stateChanged = true;
      }
    });
    
    if (stateChanged) {
      setAgreementState(newState);
    }
  }, [agreements]);
  
  const handleTermsLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: AgreementItem) => {
    e.preventDefault();
    
    // 약관 종류에 따라 모달 내용 설정
    if (item.name === 'agree_terms') {
      setModalTitle('이용약관');
      setModalContent(<TermsOfServiceContent />);
    } else if (item.name === 'agree_privacy') {
      setModalTitle('개인정보 수집 및 이용 동의');
      setModalContent(<PrivacyPolicyContent />);
    } else if (item.name === 'agree_marketing') {
      setModalTitle('마케팅 정보 수신 동의');
      setModalContent(<MarketingConsentContent />);
    }
    
    setModalOpen(true);
  };
  
  return (
    <div className={styles.termsAgreementContainer}>
      <div className={styles.termsItem}>
        <div className={styles.checkboxWrapper}>
          {/* 전체 동의 체크박스 */}
          <input
            type="checkbox"
            id="agree_all"
            name="agree_all"
            checked={agreementState.agree_all}
            onChange={handleCheckboxChange}
            className={styles.checkboxInput}
          />
          <label 
            htmlFor="agree_all"
            className={`${styles.checkboxLabel} ${styles.termsAllLabel}`}
          >
            <div 
              className={`${styles.customCheckbox} ${agreementState.agree_all ? styles.checked : ''}`}
            ></div>
            전체 동의합니다
          </label>
        </div>
      </div>
      
      {agreements.map((item) => (
        <div className={styles.termsItem} key={item.name}>
          <div className={styles.checkboxWrapper}>
            {/* 개별 동의 체크박스 */}
            <input
              type="checkbox"
              id={item.name}
              name={item.name}
              checked={!!agreementState[item.name]}
              onChange={handleCheckboxChange}
              className={styles.checkboxInput}
            />
            <label 
              htmlFor={item.name}
              className={styles.checkboxLabel}
            >
              <div 
                className={`${styles.customCheckbox} ${agreementState[item.name] ? styles.checked : ''}`}
              ></div>
              {item.required ? `(필수) ${item.label}` : `(선택) ${item.label}`}
            </label>
          </div>
          
          {showLinks && item.link && (
            <a 
              href="#" 
              className={styles.termsLink}
              onClick={(e) => handleTermsLinkClick(e, item)}
            >
              보기
            </a>
          )}
        </div>
      ))}
      
      <TermsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
};

export default TermsAgreement;