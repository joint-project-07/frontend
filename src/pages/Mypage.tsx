import React from "react";
import { useTabStore } from "../store/TabStore";
import { useShelterStore } from "../store/ShelterStore";
import "../style/Mypage.css";
import { usePaginationStore } from "../store/CurrentStore";
import "../style/Button.css";
import Modal from "../components/common/Modal";
import { useModalStore } from "../store/ModalStore";
import StarRating from "../components/common/StarRating";

interface ShelterItem {
  application_id: number;
  shelter_name: string;
  date: string;
  description: string;
  status: string;
}

interface ListProps {
  list: ShelterItem[];
  renderItem: (item: ShelterItem) => React.ReactNode;
  emptyMessage: string;
}

const PaginatedList: React.FC<ListProps> = ({
  list,
  renderItem,
  emptyMessage,
}) => {
  const { currentPage, itemsPerPage, totalPages, nextPage, prevPage, setPage } =
    usePaginationStore();

  const slicedList = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="list-section">
      {slicedList.length > 0 ? (
        <>
          {slicedList.map(renderItem)}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={currentPage === number ? "active-page" : ""}
                >
                  {number}
                </button>
              )
            )}
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </>
      ) : (
        <p>{emptyMessage}</p>
      )}
    </section>
  );
};

const ShelterList: React.FC = () => {
  const { shelterList } = useShelterStore();

  return (
    <div className="shelter-list-container">
      <img src="/images/logo.png" alt="로고 이미지" className="shelter-logo" />

      <PaginatedList
        list={shelterList}
        renderItem={(item) => (
          <div
            key={item.application_id}
            className={`shelter-card ${item.status}`}
          >
            <h3>{item.shelter_name}</h3>
            <p>예약 날짜: {item.date}</p>
            <p>봉사 활동: {item.description}</p>
            <p className={`status-${item.status}`}>
              {item.status === "pending" ? "승인 대기" : "승인 완료"}
            </p>
          </div>
        )}
        emptyMessage="예약 내역이 없습니다."
      />
    </div>
  );
};

const VolunteerHistory: React.FC = () => {
  const { shelterList } = useShelterStore();
  const {
    isOpen,
    selectedShelter,
    openModal,
    closeModal,
    rating,
    setRating,
    resetSurvey,
  } = useModalStore();

  const handleSubmit = () => {
    alert(`
    보호소: ${selectedShelter?.shelter_name}
    만족도 점수: ⭐ ${rating}점
    제출되었습니다!`);
    closeModal();
    resetSurvey();
  };

  return (
    <div className="volunteer-list-container">
      <img src="/images/logo.png" alt="로고 이미지" className="shelter-logo" />

      <PaginatedList
        list={shelterList}
        renderItem={(item) => (
          <div key={item.application_id} className="volunteer-card">
            <h3>{item.shelter_name}</h3>
            <p>예약 날짜: {item.date}</p>
            <p>봉사 활동: {item.description}</p>
            <button className="button" onClick={() => openModal(item)}>
              만족도 조사
            </button>
          </div>
        )}
        emptyMessage="봉사활동 이력이 없습니다."
      />
      <Modal isOpen={isOpen} onClose={closeModal} title="만족도 조사">
        {selectedShelter && (
          <div className="survey-container">
            <h3>만족도 조사</h3>
            <p>이번 봉사활동은 어떠셨나요?</p>
            <StarRating rating={rating} setRating={setRating} />
            <button
              className="button submit-button"
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              제출
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const TabContent: React.FC = () => {
  const { activeTab } = useTabStore();

  switch (activeTab) {
    case "info":
      return (
        <div className="mypage-container">
          <main className="mypage-content">
            <section className="profile-section">
              <div className="profile-image"></div>
              <button className="profile-edit-btn">프로필 변경</button>
            </section>
            <section className="info-section">
              <button className="info-button">사용자명</button>
              <button className="info-button">역할</button>
              <button className="info-button">펫모어핸즈와 함께해용💜</button>
              <button className="info-button">추가 버튼</button>
            </section>
          </main>
        </div>
      );
    case "shelter":
      return <ShelterList />;
    case "volunteer":
      return <VolunteerHistory />;
    default:
      return null;
  }
};

const MyPage: React.FC = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className="mypage-container">
      <header className="mypage-header">
        <button
          onClick={() => setActiveTab("info")}
          className={activeTab === "info" ? "active-tab" : ""}
        >
          내 정보
        </button>
        <button
          onClick={() => setActiveTab("shelter")}
          className={activeTab === "shelter" ? "active-tab" : ""}
        >
          보호소 승인 대기/완료
        </button>
        <button
          onClick={() => setActiveTab("volunteer")}
          className={activeTab === "volunteer" ? "active-tab" : ""}
        >
          봉사활동 이력
        </button>
      </header>
      <main>
        <TabContent />
      </main>
    </div>
  );
};

export default MyPage;