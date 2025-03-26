import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import styles from "../style/InstitutionScheduleList.module.scss";
import { useNavigate } from "react-router-dom";
import { fetchAllRecruitments, CardData } from "../api/recruitmentApi";
import useAuthStore from "../store/auth/useauthStore"; 

const InstitutionScheduleList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  useEffect(() => {
    const loadInstitutionSchedules = async () => {
      try {
        if (!user?.id) {
          setIsLoading(false);
          return;
        }
        
        // 모든 모집 정보 가져오기
        const allRecruitments = await fetchAllRecruitments();
        
        // 간단하게 기관 ID로만 필터링
        const institutionSchedules = allRecruitments.filter(
          card => card.id === user.id
        );
        
        setCards(institutionSchedules);
        setIsLoading(false);
      } catch (error) {
        console.error("일정 데이터를 불러오는 중 오류가 발생했습니다:", error);
        setIsLoading(false);
      }
    };

    loadInstitutionSchedules();
  }, [user]);

  const handleCardClick = (id: number) => {
    navigate(`/institution-detail/${id}`);
  };

  // 사용자가 기관 계정으로 로그인했는지 확인
  const isInstitution = localStorage.getItem('userType') === 'organization';
  
  if (!user || !isInstitution) {
    return (
      <div className={styles.noResultsContainer}>
        <p>기관 계정으로 로그인해주세요.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={styles.noResultsContainer}>
        <p>등록된 봉사 일정이 없습니다.</p>
        <button 
          className={styles.addScheduleButton}
          onClick={() => navigate('/add-schedule')}
        >
          새 봉사 일정 등록하기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.institutionContainer}>
      <div className={styles.institutionHeader}>
        <h2 className={styles.institutionTitle}>내 기관 봉사 일정</h2>
        <button 
          className={styles.addScheduleButton}
          onClick={() => navigate('/add-schedule')}
        >
          새 일정 등록
        </button>
      </div>
      <div className={styles.institutionGrid}>
        {cards.map((card) => (
          <Card 
            key={card.id}
            image={card.image}
            title={card.title}
            region={card.region}
            date={card.date}
            volunteerwork={card.volunteerwork}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default InstitutionScheduleList;