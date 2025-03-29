import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../style/InstitutionDetailPage.module.scss";
import dangimg from "../assets/dangimg.png";
import { 
  Volunteer, 
  approveApplication, 
  rejectApplication, 
  markAsAttended, 
  markAsAbsent,
  getRecruitment,
  getRecruitmentApplicants
} from "../api/applicationApi";

type InstitutionData = {
  id: number;
  title: string;
  region: string;
  mainActivities: string[];
  preparations: string[];
  images?: string[];
};

interface ApplicantData {
  id: number;
  user: {
    name: string;
    contact_number: string;
  };
  status: "approved" | "rejected" | string;
  attendance?: "attended" | "absent" | string;
}

const InstitutionDetailPage = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionModal, setShowRejectionModal] = useState<number | null>(null);

  useEffect(() => {
    if (!institutionId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 모집 공고 상세 정보 조회
        const recruitmentData = await getRecruitment(parseInt(institutionId));
        
        // 지원자 목록 조회
        const applicantsResponse = await getRecruitmentApplicants(parseInt(institutionId));
        
        // 응답 로그 확인
        console.log('지원자 응답 데이터 구조:', applicantsResponse);
        
        // applicants가 이중 배열로 중첩되어 있는지 확인하고 적절히 처리
        let applicantsData = applicantsResponse;
        
        // 배열인지 확인
        if (Array.isArray(applicantsResponse)) {
          // 첫 번째 요소가 다시 배열인지 확인 (중첩 배열인 경우)
          if (Array.isArray(applicantsResponse[0])) {
            applicantsData = applicantsResponse[0];
          }
        }
        
        // 다시 한번 중첩 구조 확인
        if (applicantsData?.applicants && Array.isArray(applicantsData.applicants)) {
          applicantsData = applicantsData.applicants;
        }
        
        // 최종 처리된 데이터 로그
        console.log('처리된 지원자 데이터:', applicantsData);
        
        const mappedVolunteers: Volunteer[] = [];
        
        // 지원자 데이터가 배열인 경우 처리
        if (Array.isArray(applicantsData)) {
          applicantsData.forEach((applicant: any) => {
            // 각 지원자가 객체이고 필수 필드가 있는지 확인
            if (applicant && typeof applicant === 'object') {
              // 중첩된 구조 처리 - 실제 데이터가 applicant.user에 있는지 확인
              const userData = applicant.user || applicant;
              
              mappedVolunteers.push({
                id: applicant.id || 0,
                name: userData.name || '이름 없음',
                phone: userData.contact_number || '',
                status: applicant.status === "approved" ? "승인" : 
                      applicant.status === "rejected" ? "반려" : "대기",
                attendance: applicant.attendance === "attended" ? "참석" : 
                          applicant.attendance === "absent" ? "불참석" : undefined,
                profile_image: userData.profile_image || ''
              });
            }
          });
        }
        
        let shelterId = 0;
        let shelterName = '';
        let shelterType = '';
        let shelterSupplies = '';
        let shelterRegion = '서울'; // 기본값
        
        // id 처리
        shelterId = recruitmentData.id || 0;
        
        // shelter_name 처리 (string 타입으로 직접 들어오는 경우)
        if (typeof recruitmentData.shelter_name === 'string') {
          shelterName = recruitmentData.shelter_name;
        }
        // shelter가 객체인 경우
        else if (recruitmentData.shelter && typeof recruitmentData.shelter === 'object') {
          shelterId = recruitmentData.shelter.id || 0;
          shelterName = recruitmentData.shelter.name || '';
        }
        // shelter가 ID 값인 경우
        else if (typeof recruitmentData.shelter === 'number') {
          shelterId = recruitmentData.shelter;
        }
        
        // type 처리 (string 타입 'cleaning' 등으로 들어오는 경우)
        if (typeof recruitmentData.type === 'string') {
          shelterType = recruitmentData.type;
        }
        // activities 배열이 있는 경우
        else if (Array.isArray(recruitmentData.activities) && recruitmentData.activities.length > 0) {
          shelterType = recruitmentData.activities[0];
        }
        
        // supplies 처리 (string 또는 array 타입으로 들어오는 경우)
        if (typeof recruitmentData.supplies === 'string') {
          shelterSupplies = recruitmentData.supplies;
        } 
        else if (Array.isArray(recruitmentData.supplies)) {
          shelterSupplies = recruitmentData.supplies.join(', ');
        }
        
        // 기관 정보 매핑
        const institutionInfo: InstitutionData = {
          id: shelterId,
          title: shelterName || '이름 없음',
          region: shelterRegion,
          mainActivities: shelterType ? [shelterType] : [],
          preparations: shelterSupplies ? 
            shelterSupplies.split(',').map((item: string) => item.trim()) : 
            [],
          images: []
        };
        
        console.log('매핑된 기관 정보:', institutionInfo);
        
        setVolunteers(mappedVolunteers);
        setInstitutionData(institutionInfo);
        
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [institutionId]);

  const handleStatusChange = async (id: number, status: "승인" | "반려") => {
    try {
      setLoading(true);
      
      if (status === "승인") {
        await approveApplication(id);
      } else if (status === "반려") {
        if (!rejectionReason) {
          setShowRejectionModal(id);
          return;
        }
        await rejectApplication(id, rejectionReason);
        setShowRejectionModal(null);
        setRejectionReason("");
      }
      
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v))
      );
      
    } catch (error) {
      console.error("상태 변경 중 오류 발생:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (id: number, attendance: "참석" | "불참석") => {
    try {
      setLoading(true);
      
      if (attendance === "참석") {
        await markAsAttended(id);
      } else {
        await markAsAbsent(id);
      }
      
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, attendance } : v))
      );
      
    } catch (error) {
      console.error("출석 상태 변경 중 오류 발생:", error);
      alert("출석 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const submitRejection = async () => {
    if (!showRejectionModal) return;
    
    try {
      setLoading(true);
      await rejectApplication(showRejectionModal, rejectionReason);
      
      setVolunteers((prev) =>
        prev.map((v) => (v.id === showRejectionModal ? { ...v, status: "반려" } : v))
      );
      
      setShowRejectionModal(null);
      setRejectionReason("");
      
    } catch (error) {
      console.error("신청 거절 중 오류 발생:", error);
      alert("신청 거절 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const images = institutionData?.images && institutionData.images.length > 0 
    ? institutionData.images 
    : [dangimg, dangimg, dangimg];

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
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button className={styles.backButton} onClick={handleBackClick}>
          보호기관 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!institutionData) {
    return (
      <div className={styles.loading}>
        <p>해당 기관 정보를 찾을 수 없습니다.</p>
        <button className={styles.backButton} onClick={handleBackClick}>
          보호기관 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <main className={styles.institutionDetail}>
      <button className={styles.backButton} onClick={handleBackClick}>
        &larr; 보호기관 목록으로 돌아가기
      </button>
      
      <h1 className={styles.institutionTitle}>{institutionData.title}</h1>
      
      <div className={styles.institutionInfo}>
        <div className={styles.institutionLeft}>
          <div className={styles.institutionImages}>
            <button className={styles.prevBtn} onClick={goToPrevImage}>
              {"<"}
            </button>
            <img
              src={typeof images[currentIndex] === 'string' ? images[currentIndex] : dangimg}
              alt={`기관 이미지 ${currentIndex + 1}`}
            />
            <button className={styles.nextBtn} onClick={goToNextImage}>
              {">"}
            </button>
            <div className={styles.imageIndicator}>
              {images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`${styles.indicatorDot} ${idx === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                ></span>
              ))}
            </div>
          </div>

          <section className={styles.volunteerInfo}>
            <h2>보호소 정보</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>위치:</span>
              <span className={styles.infoValue}>{institutionData.region}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>주요 봉사 활동:</span>
              <ul>
                {institutionData.mainActivities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>준비물:</span>
              <div className={styles.preparations}>
                {institutionData.preparations.map((item, index) => (
                  <span key={index} className={styles.preparationItem}>{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.institutionRight}>
          <section className={styles.volunteerList}>
            <h2>봉사 신청자 목록</h2>
            
            {volunteers.length === 0 ? (
              <p>아직 봉사 신청자가 없습니다.</p>
            ) : (
              <>
                <div className={styles.listSummary}>
                  총 {volunteers.length}명 | 승인: {volunteers.filter(v => v.status === "승인").length}명 | 
                  대기: {volunteers.filter(v => v.status === "대기").length}명 |
                  반려: {volunteers.filter(v => v.status === "반려").length}명
                </div>
                
                <div className={styles.volunteerListContainer}>
                  {volunteers.map((volunteer) => (
                    <div className={styles.volunteerItem} key={volunteer.id}>
                      <div className={styles.profilePic}>
                        <span>{volunteer.name[0]}</span>
                      </div>
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{volunteer.name}</p>
                        <p className={styles.userPhone}>{volunteer.phone}</p>
                        <p className={`${styles.status} ${styles[volunteer.status]}`}>
                          {volunteer.status}
                        </p>
                      </div>
                      {volunteer.status === "대기" && (
                        <div className={styles.buttons}>
                          <button
                            className={styles.approve}
                            onClick={() => handleStatusChange(volunteer.id, "승인")}
                          >
                            승인
                          </button>
                          <button
                            className={styles.reject}
                            onClick={() => setShowRejectionModal(volunteer.id)}
                          >
                            반려
                          </button>
                        </div>
                      )}
                      {volunteer.status === "승인" && (
                        <div className={styles.buttons}>
                          <button
                            className={`${styles.attend} ${volunteer.attendance === "참석" ? styles.active : ""}`}
                            onClick={() => handleAttendanceChange(volunteer.id, "참석")}
                          >
                            참석
                          </button>
                          <button
                            className={`${styles.absent} ${volunteer.attendance === "불참석" ? styles.active : ""}`}
                            onClick={() => handleAttendanceChange(volunteer.id, "불참석")}
                          >
                            불참석
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

      {showRejectionModal && (
        <div className={styles.rejectionModal}>
          <div className={styles.modalContent}>
            <h3>반려 사유</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="반려 사유를 입력해주세요"
              rows={4}
            />
            <div className={styles.modalButtons}>
              <button onClick={() => setShowRejectionModal(null)}>취소</button>
              <button 
                onClick={submitRejection}
                disabled={!rejectionReason.trim()}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default InstitutionDetailPage;