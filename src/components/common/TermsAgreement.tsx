import React, { useState, useEffect } from 'react';

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
  
  const handleTermsLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link?: string) => {
    e.preventDefault();
    if (link) {
      console.log(`Terms link clicked: ${link}`);
    }
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
            {showLinks && item.link && (
              <a 
                href="#" 
                className="terms-link"
                onClick={(e) => handleTermsLinkClick(e, item.link)}
              >
                보기
              </a>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TermsAgreement;