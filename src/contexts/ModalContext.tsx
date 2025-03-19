import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toggleLoginModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  previousPath: string | null;
  setPreviousPath: (path: string | null) => void;

  isPasswordModalOpen: boolean;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('volunteer'); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  
  const openLoginModal = useCallback(() => {
    setPreviousPath(location.pathname);
    setIsLoginModalOpen(true);
  }, [location.pathname]);
  
  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);
  
  const toggleLoginModal = useCallback(() => {
    setIsLoginModalOpen(prev => {
      if (!prev) {
        setPreviousPath(location.pathname);
      }
      return !prev;
    });
  }, [location.pathname]);
  
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
      previousPath,
      setPreviousPath,

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