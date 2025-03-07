import React from "react";
import { useTabStore } from "../store/TabStore";
import { useShelterStore } from "../store/ShelterStore";
import "../style/Mypage.css"
import { usePaginationStore } from "../store/CurrentStore";

const ShelterList: React.FC = () => {
  const { shelterList } = useShelterStore();
  const { currentPage, itemsPerPage, totalPages, nextPage, prevPage, setPage } =
    usePaginationStore();

  const currentGroup = Math.ceil(currentPage / 5);
  const startPage = (currentGroup - 1) * 5 + 1;
  const endPage = Math.min(currentGroup * 5, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <section className="shelter-list">
      {shelterList.length > 0 ? (
        <>
          {shelterList
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item) => (
              <div key={item.application_id} className={`shelter-card ${item.status}`}>
                <img
                  src="/images/shelter.jpg"
                  alt={`${item.shelter_name} 보호소 이미지`}
                  className="shelter-image"
                />
                <div className="shelter-info">
                  <h3>{item.shelter_name}</h3>
                  <p>예약 날짜: {item.date}</p>
                  <p>봉사 활동: {item.description}</p>
                  <p className={`status-${item.status}`}>
                    {item.status === "pending" ? "승인 대기" : "승인 완료"}
                  </p>
                </div>
              </div>
            ))}

          <div>
            <button onClick={prevPage} disabled={currentPage === 1}>
              이전
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setPage(number)}
                className={currentPage === number ? "active-page" : ""}
              >
                {number}
              </button>
            ))}
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </>
      ) : (
        <p>예약 내역이 없습니다.</p>
      )}
    </section>
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
      return <section>봉사활동 이력 정보</section>;
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
