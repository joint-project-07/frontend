import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import styles from '../../style/LandingPage.module.scss';
import { fetchAllRecruitments, CardData } from '../../api/recruitmentApi';

const ShelterCards = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecruitments = async () => {
      try {
        setIsLoading(true);
        const recruitmentCards = await fetchAllRecruitments();
        setCards(recruitmentCards);
        setError(null);
      } catch (err) {
        setError('봉사 모집 데이터를 불러오는데 실패했습니다.');
        console.error('데이터 로딩 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecruitments();
  }, []);

  const handleCardClick = (card: CardData) => {
    navigate(`/detail/${card.id}`);
  };

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} ${styles.contentSpacing}`}>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button 
          className={styles.retryButton} 
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={styles.noResultsContainer}>
        <p>현재 등록된 봉사 모집이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.cardGrid}>
      {cards.map((card) => (
        <Card 
          key={card.id}
          {...card}
          onClick={() => handleCardClick(card)}
        />
      ))}
    </div>
  );
};

export default ShelterCards;