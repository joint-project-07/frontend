import { useState, useEffect } from 'react';
import Card from './Card';
import styles from '../../style/LandingPage.module.scss';
import { fetchAllRecruitments, CardData } from '../../api/recruitmentApi';

const ShelterCards = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecruitments = async () => {
      try {
        const recruitmentCards = await fetchAllRecruitments();
        
        setCards(recruitmentCards);
        setIsLoading(false);
      } catch (_error) {
        // 에러는 사용하지 않으므로 언더스코어 접두사를 사용하여 무시
        setIsLoading(false);
      }
    };

    loadRecruitments();
  }, []);

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} ${styles.contentSpacing}`}>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={styles.noResultsContainer}>
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.cardGrid}>
      {cards.map((card) => (
        <Card 
          key={card.id}
          {...card}
          onClick={() => {
            // 추후 상세 페이지 등으로 이동하는 로직 추가 가능
            console.log('봉사 모집 선택:', card.title);
          }}
        />
      ))}
    </div>
  );
};

export default ShelterCards;