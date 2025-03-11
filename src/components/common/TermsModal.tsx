import React, { useState, useEffect } from 'react';
import '../../style/TermsModal.css';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, title, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = 'auto';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isVisible && (
        <div 
          className={`terms-modal-backdrop ${isOpen ? 'show' : 'hide'}`} 
          onClick={handleBackdropClick}
        >
          <div className={`terms-modal-container ${isOpen ? 'show' : 'hide'}`}>
            <div className="terms-modal-header">
              <h2>{title}</h2>
              <button className="terms-modal-close" onClick={onClose}>×</button>
            </div>
            <div className="terms-modal-content">
              {content}
            </div>
            <div className="terms-modal-footer">
              <button onClick={onClose} className="terms-modal-confirm-btn">확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsModal;