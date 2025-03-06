import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import "../style/LandingPage.css";

interface CardData {
  id: number;
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
}

const LandingPage: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    // Array.from을 사용하여 15개 데이터 생성
    const data = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      image: "https://via.placeholder.com/150",
      title: `펫모어핸즈 봉사센터 ${index + 1}`,
      region: `서울특별시 종로구`,
      date: `2025.02.${index}`,
      volunteerwork: "견사청소, 산책",
    }));

    setCards(data);
  }, []);

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
};

export default LandingPage;
