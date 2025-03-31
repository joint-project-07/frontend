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
import { convertCodeToType } from "../api/recruitmentApi";

type InstitutionData = {
  id: number;
  title: string;
  region: string;
  mainActivities: string[];
  preparations: string[];
  images?: string[];
};

interface ShelterInfo {
  id: number;
  name: string;
  region: string;
}

interface RecruitmentResponse {
  id: number;
  shelter: number | ShelterInfo;
  shelter_name?: string;
  shelter_region?: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string[] | string;
  supplies: string;
  status: string;
  images?: string[];
  recruitment?: RecruitmentResponse;
}

interface ApplicantData {
  id?: number;
  name?: string;
  contact_number?: string;
  status?: string;
  attendance?: string;
  profile_image?: string;
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
        
        const response = await getRecruitment(parseInt(institutionId || '0'));
        const recruitmentData: RecruitmentResponse = response.recruitment || response;
        
        console.log('원본 API 응답:', response);
      console.log('처리된 모집 데이터:', recruitmentData);
        
        let mainActivities: string[] = [];
        if (recruitmentData.type) {
          if (typeof recruitmentData.type === 'string') {
            try {
              const typesArray = JSON.parse(recruitmentData.type);
              if (Array.isArray(typesArray)) {
                mainActivities = typesArray.map((code: string) => convertCodeToType(code));
              } else {
                mainActivities = [convertCodeToType(recruitmentData.type as string)];
              }
            } catch {
              mainActivities = [convertCodeToType(recruitmentData.type as string)];
            }
          } else if (Array.isArray(recruitmentData.type)) {
            mainActivities = recruitmentData.type.map((code: string) => convertCodeToType(code));
          }
        }
        
        let preparations: string[] = [];
        if (recruitmentData.supplies && typeof recruitmentData.supplies === 'string') {
          const suppliesStr = recruitmentData.supplies.trim();
          if (suppliesStr) {
            preparations = suppliesStr.split(', ');
          }
        }
        
        let shelterId = 0;
        let shelterName = '';
        let shelterRegion = '';
        
        if (typeof recruitmentData.shelter === 'number') {
          shelterId = recruitmentData.shelter;
          shelterName = recruitmentData.shelter_name || '';
          shelterRegion = recruitmentData.shelter_region || '';
        } else if (recruitmentData.shelter && typeof recruitmentData.shelter === 'object') {
          const shelterObj = recruitmentData.shelter as ShelterInfo;
          shelterId = shelterObj.id || 0;
          shelterName = shelterObj.name || '';
          shelterRegion = shelterObj.region || '';
        }
        
        const institutionInfo: InstitutionData = {
          id: shelterId,
          title: shelterName,
          region: shelterRegion,
          mainActivities: mainActivities,
          preparations: preparations,
          images: recruitmentData.images || []
        };
        
        setInstitutionData(institutionInfo);
        
        try {
          const applicantsData = await getRecruitmentApplicants(parseInt(institutionId || '0'));
console.log('지원자 데이터:', applicantsData);
          
const applicantsArray = Array.isArray(applicantsData) 
? applicantsData 
: (applicantsData.applicants && Array.isArray(applicantsData.applicants))
  ? applicantsData.applicants
  : [];
  console.log('사용할 applicants 배열:', applicantsArray);
  const mappedVolunteers = applicantsArray.flatMap((item: ApplicantData | ApplicantData[]) => {
    if (Array.isArray(item)) {
      return item.map(subItem => ({
        id: subItem.id || 0,
        name: subItem.name || '',
        phone: subItem.contact_number || '',
        status: subItem.status === "approved" ? "승인" : 
                subItem.status === "rejected" ? "반려" : "대기",
        attendance: subItem.attendance === "attended" ? "참석" : 
                   subItem.attendance === "absent" ? "불참석" : undefined,
        profile_image: subItem.profile_image || ''
      }));
    }
    
    return {
      id: item.id || 0,
      name: item.name || '',
      phone: item.contact_number || '',
      status: item.status === "approved" ? "승인" : 
             item.status === "rejected" ? "반려" : "대기",
      attendance: item.attendance === "attended" ? "참석" : 
                 item.attendance === "absent" ? "불참석" : undefined,
      profile_image: item.profile_image || ''
    };
  });
          
          console.log('매핑된 volunteers:', mappedVolunteers);
          setVolunteers(mappedVolunteers);
        } catch (error) {
          console.error("지원자 정보 로딩 중 오류 발생:", error);
          setVolunteers([]);
        }
    
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
                {institutionData.preparations.length > 0 ? (
                  institutionData.preparations.map((item, index) => (
                    <span key={index} className={styles.preparationItem}>{item}</span>
                  ))
                ) : (
                  <span>준비물 없음</span>
                )}
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
                        {volunteer.profile_image ? (
                          <img 
                            src={volunteer.profile_image} 
                            alt={`${volunteer.name}의 프로필`} 
                            className={styles.profileImage}
                          />
                        ) : (
                          <span>{volunteer.name[0]}</span>
                        )}
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