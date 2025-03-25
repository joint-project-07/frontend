import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import styles from "../style/LandingPage.module.scss";
import SearchBar from "../components/feature/SearchBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useModalContext } from '../contexts/ModalContext';
import { fetchAllRecruitments, searchRecruitments, CardData, SearchParams } from '../api/recruitmentApi';

interface LocationState {
  activeTab: string;
  openLoginModal?: boolean;
  from?: string;
}

const LandingPage: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
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
  
  // 페이지 로드 시 전체 목록 가져오기
  useEffect(() => {
    loadAllRecruitments();
  }, []);

  // 전체 목록 가져오는 함수 (최대 15개)
  const loadAllRecruitments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllRecruitments();
      // 최대 15개만 표시
      setCards(data.slice(0, 15));
    } catch (error) {
      console.error('Error loading recruitments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = async (searchParams: SearchParams) => {
    // 검색 조건이 있는지 확인
    const hasSearchConditions = (
      (searchParams.locations?.length || 0) > 0 ||
      searchParams.dateRange !== null ||
      searchParams.timeRange !== null
    );
    
    setIsLoading(true);
    try {
      // 검색 조건이 있으면 검색 API 호출, 없으면 전체 목록 API 호출
      if (hasSearchConditions) {
        console.log('검색 조건 적용:', searchParams);
        const data = await searchRecruitments(searchParams);
        setCards(data);
      } else {
        console.log('검색 조건 없음, 전체 목록 표시');
        await loadAllRecruitments();
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
        <>
          {cards.length > 0 ? (
            <div className={styles.cardGrid}>
              {cards.map((card) => (
                <Card
                  key={card.id}
                  {...card}
                  onClick={() => navigate(`/detail/${card.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResultsContainer}>
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LandingPage;