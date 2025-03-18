import React from "react";
import { useTabStore } from "../store/TabStore";
import { useShelterStore } from "../store/ShelterStore";
import styles from "../style/Mypage.module.scss";
import { TabType, usePaginationStore } from "../store/CurrentStore";
import "../style/Button.css";
import Modal from "../components/common/Modal";
import useModalStore from "../store/modalStore";
import StarRating from "../components/common/StarRating";

interface ShelterItem {
  application_id: number;
  shelter_name: string;
  date: string;
  description: string;
  status: string;
}

interface ListProps {
  tabType: TabType; 
  list: ShelterItem[];
  renderItem: (item: ShelterItem) => React.ReactNode;
  emptyMessage: string;
}

const PaginatedList: React.FC<ListProps> = ({
  tabType,
  list,
  renderItem,
  emptyMessage,
}) => {
  const { itemsPerPage, getPage, getTotalPages, nextPage, prevPage, setPage, setTotalPages } =
    usePaginationStore();
  
  React.useEffect(() => {
    const total = Math.ceil(list.length / itemsPerPage);
    setTotalPages(tabType, total);
  }, [list, itemsPerPage, tabType, setTotalPages]);

  const currentPage = getPage(tabType);
  const totalPages = getTotalPages(tabType);

  const slicedList = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className={styles.listSection}>
      {slicedList.length > 0 ? (
        <>
          {slicedList.map(renderItem)}
          <div className={styles.pagination}>
            <button onClick={() => prevPage(tabType)} disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setPage(tabType, number)}
                  className={currentPage === number ? styles.activePage : ""}
                >
                  {number}
                </button>
              )
            )}
            <button onClick={() => nextPage(tabType)} disabled={currentPage === totalPages}>
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
    <div className={styles.shelterListContainer}>
      <PaginatedList
        tabType="shelter" 
        list={shelterList}
        renderItem={(item) => (
          <div key={item.application_id} className={styles.shelterCard}>
            <h3>{item.shelter_name}</h3>
            <p>예약 날짜: {item.date}</p>
            <p>봉사 활동: {item.description}</p>
            <p
              className={
                item.status === "pending"
                  ? styles.statusPending
                  : styles.statusComplete
              }
            >
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
    <div className={styles.volunteerListContainer}>
      <PaginatedList
        tabType="volunteer"
        list={shelterList}
        renderItem={(item) => (
          <div key={item.application_id} className={styles.volunteerCard}>
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
          <div className={styles.surveyContainer}>
            <h3>만족도 조사</h3>
            <p>이번 봉사활동은 어떠셨나요?</p>
            <StarRating rating={rating} setRating={setRating} />
            <button
              className={styles.submitButton}
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
        <div className={styles.mypageContainer}>
          <main className={styles.mypageContent}>
            <section className={styles.profileSection}>
              <div className={styles.profileImage}></div>
              <button className={styles.profileEditBtn}>프로필 변경</button>
            </section>
            <section className={styles.infoSection}>
              <button className={styles.infoButton}>사용자명</button>
              <button className={styles.infoButton}>
                펫모어핸즈와 함께해용💜
              </button>
              <button className={styles.infoButton}>추가 버튼</button>
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
    <div className={styles.mypageContainer}>
      <header className={styles.mypageHeader}>
        <button
          onClick={() => setActiveTab("info")}
          className={activeTab === "info" ? styles.activeTab : ""}
        >
          내 정보
        </button>
        <button
          onClick={() => setActiveTab("shelter")}
          className={activeTab === "shelter" ? styles.activeTab : ""}
        >
          보호소 승인 대기/완료
        </button>
        <button
          onClick={() => setActiveTab("volunteer")}
          className={activeTab === "volunteer" ? styles.activeTab : ""}
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
