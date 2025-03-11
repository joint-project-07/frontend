import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import styles from "../style/InstitutionScheduleList.module.scss";
import { useNavigate } from "react-router-dom";

interface CardData {
  id: number;
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
}

const InstitutionScheduleList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      image: "https://via.placeholder.com/300x200",
      title: `보호기관 ${index + 1}`,
      region:
        index % 3 === 0
          ? "서울특별시 마포구"
          : index % 3 === 1
          ? "서울특별시 서초구"
          : "경기도 성남시",
      date: `2025.${Math.floor(Math.random() * 12) + 1}.${
        Math.floor(Math.random() * 28) + 1
      }`,
      volunteerwork: index % 2 === 0 ? "청소 및 관리" : "동물 돌보기",
    }));

    setCards(data);
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/institution-detail/${id}`);
  };

  return (
    <div className={styles.institutionContainer}>
      <h2 className={styles.institutionTitle}>보호기관 일정</h2>
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