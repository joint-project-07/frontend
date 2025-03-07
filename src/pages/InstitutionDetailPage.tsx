import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/InstitutionDetailPage.css";

type Volunteer = {
  id: number;
  name: string;
  phone: string;
  status: "승인" | "반려" | "대기";
};

const InstitutionDetailPage = () => {
  const { institutionId } = useParams();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 이미지 인덱스 상태

  useEffect(() => {
    if (!institutionId) return;

    const data: Volunteer[] = [
      { id: 1, name: "홍길동", phone: "010-1234-5678", status: "대기" },
      { id: 2, name: "김철수", phone: "010-5678-1234", status: "대기" },
      { id: 3, name: "이영희", phone: "010-9876-5432", status: "승인" },
    ];
    setVolunteers(data);
  }, [institutionId]);

  const handleStatusChange = (id: number, status: "승인" | "반려") => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  const images = [
    "/src/assets/dangimg.png", // dangimg.png 경로
    "/src/assets/dangimg.png", // 이미지를 여러 개 추가 가능
    "/src/assets/dangimg.png",
  ];

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <main className="institution-detail">
      {/* 기관 정보 출력 */}
      <div className="institution-info">
        <div className="institution-left">
          {/* 캐러셀 (이미지 슬라이드) */}
          <div className="institution-images">
            <button className="prev-btn" onClick={goToPrevImage}>
              {"<"}
            </button>
            <img
              src={images[currentIndex]}
              alt={`기관 이미지 ${currentIndex + 1}`}
            />
            <button className="next-btn" onClick={goToNextImage}>
              {">"}
            </button>
          </div>

          {/* 보호소 정보 */}
          <section className="volunteer-info">
            <h2>보호소 위치: 서울특별시 / 동작구</h2>
            <p>주요 봉사 활동 내용:</p>
            <ul>
              <li>견사 청소</li>
              <li>미용</li>
              <li>목욕</li>
              <li>산책</li>
              <li>밥주기 등</li>
            </ul>
            <p>준비물: 물, 막 입을 수 있는 옷</p>
          </section>
        </div>

        <div className="institution-right">
          {/* 봉사자 목록 */}
          <section className="volunteer-list">
            {volunteers.length === 0 ? (
              <p>봉사자 목록을 불러오는 중...</p>
            ) : (
              volunteers.map((volunteer) => (
                <div className="volunteer-item" key={volunteer.id}>
                  <div className="profile-pic"></div>
                  <div className="user-info">
                    <p>{volunteer.name}</p>
                    <p>{volunteer.phone}</p>
                    <p className={`status ${volunteer.status.toLowerCase()}`}>
                      {volunteer.status}
                    </p>
                  </div>
                  {volunteer.status === "대기" && (
                    <div className="buttons">
                      <button
                        className="approve"
                        onClick={() => handleStatusChange(volunteer.id, "승인")}
                      >
                        승인
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleStatusChange(volunteer.id, "반려")}
                      >
                        반려
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default InstitutionDetailPage;
