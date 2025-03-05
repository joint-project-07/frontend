import React from "react";
import "../style/MyPage.css";

const MyPage: React.FC = () => {
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
};

export default MyPage;
