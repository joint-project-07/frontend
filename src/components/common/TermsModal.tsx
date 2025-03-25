import React, { useState, useEffect } from 'react';
import styles from '../../style/TermsModal.module.scss';

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
          className={`${styles.termsModalBackdrop} ${isOpen ? styles.show : styles.hide}`} 
          onClick={handleBackdropClick}
        >
          <div className={`${styles.termsModalContainer} ${isOpen ? styles.show : styles.hide}`}>
            <div className={styles.termsModalHeader}>
              <h2>{title}</h2>
              <button className={styles.termsModalClose} onClick={onClose}>×</button>
            </div>
            <div className={styles.termsModalContent}>
              {content}
            </div>
            <div className={styles.termsModalFooter}>
              <button onClick={onClose} className={styles.termsModalConfirmBtn}>확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsModal;