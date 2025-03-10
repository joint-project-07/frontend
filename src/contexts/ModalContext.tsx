import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toggleLoginModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);
  
  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);
  
  const toggleLoginModal = useCallback(() => {
    setIsLoginModalOpen(prev => !prev);
  }, []);
  
  return (
    <ModalContext.Provider value={{ 
      isLoginModalOpen, 
      openLoginModal, 
      closeLoginModal, 
      toggleLoginModal 
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};