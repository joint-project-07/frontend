import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import "../style/LandingPage.css";
import SearchBar from "../components/feature/SearchBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useModalContext } from '../contexts/ModalContext';

interface CardData {
  id: number;
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
}

interface LocationState {
  activeTab: string;
  openLoginModal?: boolean;
  from?: string;
}

const LandingPage: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
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
  
  useEffect(() => {
    // Array.from을 사용하여 15개 데이터 생성
    const data = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      image: "https://via.placeholder.com/300x200",
      title: `펫모어핸즈 봉사센터 ${index + 1}`,
      region:
        index % 3 === 0
          ? "서울특별시 종로구"
          : index % 3 === 1
          ? "서울특별시 강남구"
          : "경기도 고양시",
      date: `2025.${Math.floor(Math.random() * 12) + 1}.${
        Math.floor(Math.random() * 28) + 1
      }`,
      volunteerwork: index % 2 === 0 ? "견사청소, 산책" : "급식 봉사, 놀이활동",
    }));

    setCards(data);
  }, []);

  return (
    <div className="landing-container">
      <SearchBar />
      {/* 카드 그리드 */}
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            {...card}
            onClick={() => navigate(`/detail/${card.id}`)} // ✅ 클릭 시 이동
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;