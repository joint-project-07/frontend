import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toggleLoginModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  isPasswordModalOpen: boolean;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('volunteer'); // 기본값은 volunteer
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);
  
  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);
  
  const toggleLoginModal = useCallback(() => {
    setIsLoginModalOpen(prev => !prev);
  }, []);
  
  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);
  
  const openPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);
  
  const closePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ 
      isLoginModalOpen, 
      openLoginModal, 
      closeLoginModal, 
      toggleLoginModal,
      activeTab,
      setActiveTab: handleSetActiveTab,

      isPasswordModalOpen,
      openPasswordModal,
      closePasswordModal
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