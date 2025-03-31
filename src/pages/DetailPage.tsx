import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../style/DetailPage.module.scss";
import useStore from "../store/Detail";
import useModalStore from "../store/ModalStore";
import DetailModal from "../components/common/DetailModal";
import ShelterImageSwiper from "../components/common/ShelterImageSwiper";
import { useModalContext } from "../contexts/ModalContext";
import useAuth from "../store/auth/useauthStore";
import { fetchRecruitmentDetail, convertCodeToType } from "../api/recruitmentApi";

interface ShelterDetail {
  id: number;
  shelter: number;
  shelter_name: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  supplies: string;
  status: string;
}

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTime = useStore((state) => state.selectedTime);
  const setSelectedTime = useStore((state) => state.setSelectedTime);
  
  const { openModal, isOpen: isDetailModalOpen } = useModalStore();
  const { openLoginModal, isLoginModalOpen, setPreviousPath } = useModalContext();
  
  const { isAuthenticated, user } = useAuth();
  
  const [shelterData, setShelterData] = useState<ShelterDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const prevAuthRef = useRef(isAuthenticated);

  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname, setPreviousPath]);

  const formatDateWithDay = (dateString: string): string => {
    if (!dateString) return "날짜 정보 없음";
    
    const date = new Date(dateString);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = date.getDay();
    
    return `${dateString} ${day[dayOfWeek]}요일`;
  };

  useEffect(() => {
    const loadShelterDetail = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecruitmentDetail(id);
        console.log("API 응답 데이터:", data); 
        
        if (data.start_time) {
          data.start_time = formatTime(data.start_time);
        }
        if (data.end_time) {
          data.end_time = formatTime(data.end_time);
        }
        
        setShelterData(data);
        
        if (data.start_time && data.end_time) {
          setSelectedTime(`${data.start_time} ~ ${data.end_time}`);
        }
        
        setError(null);
      } catch (err) {
        setError('보호소 상세 정보를 불러오는데 실패했습니다.');
        console.error('상세 정보 로딩 오류:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadShelterDetail();
  }, [id, setSelectedTime]);
  
const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  const match = timeString.match(/(\d{2}):(\d{2}):/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return timeString;
};

  useEffect(() => {
    console.log("인증 상태 변화 감지:", {
      이전인증상태: prevAuthRef.current,
      현재인증상태: isAuthenticated,
      모달열기대기중: pendingModalOpen,
      로그인모달열림상태: isLoginModalOpen,
      현재사용자: user,
    });

    if (!isLoginModalOpen && !prevAuthRef.current && isAuthenticated && pendingModalOpen && shelterData) {
      console.log("로그인 후 디테일 모달 열기 시도");
      
      setPendingModalOpen(false);
      
      setTimeout(() => {
        console.log("디테일 모달 열기 실행");
        openModal({
          shelter_name: shelterData.shelter_name, 
          description: shelterData.type 
        });
      }, 300); 
    }
    
    prevAuthRef.current = isAuthenticated;
  }, [isLoginModalOpen, isAuthenticated, pendingModalOpen, shelterData, user, openModal]);

  useEffect(() => {
    console.log("디테일 모달 상태:", isDetailModalOpen);
  }, [isDetailModalOpen]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleApplyClick = () => {
    console.log("신청하기 버튼 클릭", { 인증상태: isAuthenticated });
    
    if (isAuthenticated && shelterData) {
      console.log("인증된 상태에서 모달 열기");
      openModal({
        shelter_name: shelterData.shelter_name, 
        description: shelterData.type,
        recruitmentId: shelterData.id,
        shelterId: shelterData.shelter
      });
    } else {
      console.log("비인증 상태에서 로그인 모달 열기");
      setPendingModalOpen(true);
      setPreviousPath(location.pathname);
      openLoginModal();
    }
  };

  if (isLoading) {
    return (
      <div className={styles["loading-container"]}>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !shelterData) {
    return (
      <div className={styles["error-container"]}>
        <p>{error || "보호소 정보를 불러올 수 없습니다."}</p>
        <button 
          className={styles["back-btn"]} 
          onClick={handleGoBack}
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles["detail-container"]}>
      <div className={styles["back-button-container"]}>
        <button onClick={handleGoBack} className={styles["back-btn"]}>
          돌아가기
        </button>
      </div>
      
      <ShelterImageSwiper shelterId={String(shelterData.shelter)} />

      <div className={styles["detail-content"]}>
        <div className={styles["shelter-info"]}>
          <h2>📌 {shelterData.shelter_name}</h2>
          <div className={styles["shelter-location"]}>
            <h3>보호소 위치: 서울특별시 / 동작구</h3>
            <p>주요 봉사 활동 내용:</p>
            <ul>
    {Array.isArray(shelterData.type) ? 
      shelterData.type.map((activity, index) => (
        <li key={index}>{convertCodeToType(activity)}</li>
      )) : 
      typeof shelterData.type === 'string' ?
        shelterData.type.split(', ').map((activity, index) => (
          <li key={index}>{convertCodeToType(activity)}</li>
        )) :
        <li>{"청소"}</li>
    }
  </ul>
            <p>준비물: {shelterData.supplies || "물, 막 입을 수 있는 옷"}</p>
          </div>
        </div>

        <div className={styles["volunteer-time"]}>
          <div className={styles["date-selection"]}>
            <div className={styles["date-row"]}>
              <div className={styles["date-label"]}>선택 날짜:</div>
              <div className={styles["date-value"]}>{formatDateWithDay(shelterData.date)}</div>
            </div>

            <div className={styles["time-label"]}>봉사시간:</div>
            <div className={styles["time-buttons"]}>
              {shelterData.start_time && shelterData.end_time ? (
                <button
                  className={selectedTime === `${shelterData.start_time} ~ ${shelterData.end_time}` ? styles.selected : ""}
                  onClick={() => handleTimeSelect(`${shelterData.start_time} ~ ${shelterData.end_time}`)}
                >
                  {shelterData.start_time} ~ {shelterData.end_time}
                </button>
              ) : (
                <p>봉사 시간 정보가 없습니다.</p>
              )}
            </div>

            <div className={styles["note-container"]}>
              봉사 시간은 선택 후 변경이 어려우니 신중하게 선택해주세요.
            </div>

            <button
              className={styles["apply-btn"]}
              disabled={!selectedTime}
              onClick={handleApplyClick}
            >
              신청하기
            </button>
          </div>
        </div>
      </div>

      <DetailModal />
    </div>
  );
};

export default DetailPage;
