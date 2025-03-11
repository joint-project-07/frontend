import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/InstitutionDetailPage.css";
import dangimg from "../assets/dangimg.png";

type Volunteer = {
  id: number;
  name: string;
  phone: string;
  status: "승인" | "반려" | "대기";
};

type InstitutionData = {
  id: number;
  title: string;
  region: string;
  mainActivities: string[];
  preparations: string[];
};

const InstitutionDetailPage = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!institutionId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const volunteersData: Volunteer[] = [
          { id: 1, name: "홍길동", phone: "010-1234-5678", status: "대기" },
          { id: 2, name: "김철수", phone: "010-5678-1234", status: "대기" },
          { id: 3, name: "이영희", phone: "010-9876-5432", status: "승인" },
          { id: 4, name: "박지민", phone: "010-2468-1357", status: "반려" },
          { id: 5, name: "최유진", phone: "010-1357-2468", status: "대기" },
        ];
        
        const institutionData: InstitutionData = {
          id: parseInt(institutionId),
          title: `펫모어핸즈 ${institutionId}호점`,
          region: "서울특별시 동작구 상도로 369",
          mainActivities: ["견사 청소", "미용", "목욕", "산책", "밥주기", "놀이 활동"],
          preparations: ["물", "편안한 운동복", "여분의 옷", "마스크", "장갑"]
        };
        
        setTimeout(() => {
          setVolunteers(volunteersData);
          setInstitutionData(institutionData);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [institutionId]);

  const handleStatusChange = (id: number, status: "승인" | "반려") => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  const images = [
    dangimg, 
    dangimg, 
    dangimg,
  ];

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleBackClick = () => {
    navigate('/institution-schedule');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!institutionData) {
    return (
      <div className="loading">
        <p>해당 기관 정보를 찾을 수 없습니다.</p>
        <button className="back-button" onClick={handleBackClick}>
          보호기관 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <main className="institution-detail">
      <button className="back-button" onClick={handleBackClick}>
        &larr; 보호기관 목록으로 돌아가기
      </button>
      
      <h1 className="institution-title">{institutionData.title}</h1>
      
      <div className="institution-info">
        <div className="institution-left">
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
            <div className="image-indicator">
              {images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                ></span>
              ))}
            </div>
          </div>

          <section className="volunteer-info">
            <h2>보호소 정보</h2>
            <div className="info-item">
              <span className="info-label">위치:</span>
              <span className="info-value">{institutionData.region}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">주요 봉사 활동:</span>
              <ul>
                {institutionData.mainActivities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            
            <div className="info-item">
              <span className="info-label">준비물:</span>
              <div className="preparations">
                {institutionData.preparations.map((item, index) => (
                  <span key={index} className="preparation-item">{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="institution-right">
          <section className="volunteer-list">
            <h2>봉사 신청자 목록</h2>
            
            {volunteers.length === 0 ? (
              <p>아직 봉사 신청자가 없습니다.</p>
            ) : (
              <>
                <div className="list-summary">
                  총 {volunteers.length}명 | 승인: {volunteers.filter(v => v.status === "승인").length}명 | 
                  대기: {volunteers.filter(v => v.status === "대기").length}명 |
                  반려: {volunteers.filter(v => v.status === "반려").length}명
                </div>
                
                <div className="volunteer-list-container">
                  {volunteers.map((volunteer) => (
                    <div className="volunteer-item" key={volunteer.id}>
                      <div className="profile-pic">
                        <span>{volunteer.name[0]}</span>
                      </div>
                      <div className="user-info">
                        <p className="user-name">{volunteer.name}</p>
                        <p className="user-phone">{volunteer.phone}</p>
                        <p className={`status ${volunteer.status}`}>
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
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default InstitutionDetailPage;