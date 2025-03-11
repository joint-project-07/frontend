import React, { useState, useEffect } from 'react';
import TermsModal from './TermsModal';
import { TermsOfServiceContent, PrivacyPolicyContent, MarketingConsentContent } from './TermsContent';

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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    const newState: AgreementState = { ...agreementState };
    
    if (name === 'agree_all') {
      newState.agree_all = checked;
      
      agreements.forEach(item => {
        newState[item.name] = checked;
      });
    } 
    else {
      newState[name] = checked;
      
      const allAgreed = agreements.every(item => newState[item.name]);
      newState.agree_all = allAgreed;
    }
    
    setAgreementState(newState);
    
    if (onAgreementChange) {
      onAgreementChange(newState);
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
    <div className="terms-agreement-container">
      <div className="terms-checkbox">
        <input
          type="checkbox"
          id="agree_all"
          name="agree_all"
          checked={agreementState.agree_all}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="agree_all">
          전체 동의합니다
        </label>
      </div>
      
      {agreements.map((item) => (
        <div className="terms-checkbox" key={item.name}>
          <input
            type="checkbox"
            id={item.name}
            name={item.name}
            checked={!!agreementState[item.name]}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={item.name}>
            {item.required ? `(필수) ${item.label}` : `(선택) ${item.label}`}
            {showLinks && (
              <a 
                href="#" 
                className="terms-link"
                onClick={(e) => handleTermsLinkClick(e, item)}
              >
                보기
              </a>
            )}
          </label>
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