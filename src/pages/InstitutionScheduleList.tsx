import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import styles from "../style/InstitutionScheduleList.module.scss";
import { useNavigate } from "react-router-dom";
import { fetchInstitutionRecruitments, CardData } from "../api/recruitmentApi";
import useAuthStore from "../store/auth/useauthStore"; 

const InstitutionScheduleList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstitution, setIsInstitution] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setIsInstitution(userType === 'organization');
  }, []);
  
  useEffect(() => {
    const loadInstitutionSchedules = async () => {
      try {
        if (!isInstitution) {
          setIsLoading(false);
          return;
        }
        
        const institutionSchedules = await fetchInstitutionRecruitments(user?.id || 0);
        setCards(institutionSchedules);
        setIsLoading(false);
      } catch (error) {
        console.error("일정 데이터를 불러오는 중 오류가 발생했습니다:", error);
        setIsLoading(false);
      }
    };

    loadInstitutionSchedules();
  }, [user, isInstitution]);

  const handleCardClick = (id: number) => {
    navigate(`/institution-detail/${id}`);
  };

  const handleAddSchedule = () => {
    navigate('/institution-schedule/');
  };
  
  if (!isInstitution) {
    return (
      <div className={styles.noResultsContainer}>
        <p>기관 계정으로 로그인해주세요.</p>
        <button 
          className={styles.loginButton}
          onClick={() => navigate('/')}
        >
          메인 페이지로 돌아가기
        </button>
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
          onClick={handleAddSchedule}
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