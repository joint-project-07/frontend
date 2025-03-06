import React from "react";
import { useTabStore } from "../store/TabStore";
import "../style/MyPage.css";

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
      return <section>보호소 승인 대기/완료 정보</section>;
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
