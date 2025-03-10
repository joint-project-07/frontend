import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import "../style/InstitutionScheduleList.css";

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

  return (
    <div className="institution-container">
      <h2 className="institution-title">보호기관 일정</h2>
      <div className="institution-grid">
        {cards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default InstitutionScheduleList;
