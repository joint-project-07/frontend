import React, { useEffect, useState } from "react";
import ShelterCards from "../components/common/ShelterCards"; 
import styles from "../style/LandingPage.module.scss";
import SearchBar from "../components/feature/SearchBar";
import { useLocation } from "react-router-dom";
import { useModalContext } from '../contexts/ModalContext';
import { searchRecruitments, SearchParams } from '../api/recruitmentApi'; 

interface LocationState {
  activeTab: string;
  openLoginModal?: boolean;
  from?: string;
}

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const { openLoginModal, setActiveTab } = useModalContext();

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state && state.from === 'signup' && state.openLoginModal === true) {
      openLoginModal();
      if (state.activeTab === 'organization') {
        setActiveTab('organization');
      }
    }
  }, [location.state, openLoginModal, setActiveTab]);

  const handleSearch = async (searchParams: SearchParams) => {
    const hasSearchConditions = (
      (searchParams.locations?.length || 0) > 0 ||
      searchParams.dateRange !== null ||
      searchParams.timeRange !== null
    );
    
    setIsLoading(true);
    try {
      if (hasSearchConditions) {
        console.log('검색 조건 적용:', searchParams);
        await searchRecruitments(searchParams);
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.landingContainer}>
      <SearchBar onSearch={handleSearch} />
      
      {isLoading ? (
        <div className={`${styles.loadingContainer} ${styles.contentSpacing}`}>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <ShelterCards />
      )}
    </div>
  );
};

export default LandingPage;