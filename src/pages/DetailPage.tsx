import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../style/DetailPage.module.scss"; 
import useStore from "../store/Detail";
import useModalStore from "../store/modalStore";
import DetailModal from "../components/common/DetailModal";
import ShelterImageSwiper from "../components/common/ShelterImageSwiper";
import { useModalContext } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = useStore((state) => state.selectedDate);
  const selectedTime = useStore((state) => state.selectedTime);
  const setSelectedTime = useStore((state) => state.setSelectedTime);
  
  // Modal Store에서 필요한 상태와 함수 가져오기
  const { openModal, isOpen: isDetailModalOpen } = useModalStore();
  const { openLoginModal, isLoginModalOpen, setPreviousPath } = useModalContext();
  
  // 통합된 AuthContext에서 인증 상태 가져오기
  const { isAuthenticated, user } = useAuth();
  
  // 로그인 완료 후 모달을 열어야 함을 나타내는 상태
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  // 이전 인증 상태를 추적하기 위한 ref
  const prevAuthRef = useRef(isAuthenticated);

  // 현재 경로 저장
  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname, setPreviousPath]);

  // 인증 상태 변화 감지 및 모달 표시 처리
  useEffect(() => {
    console.log("인증 상태 변화 감지:", { 
      이전인증상태: prevAuthRef.current, 
      현재인증상태: isAuthenticated,
      모달열기대기중: pendingModalOpen,
      로그인모달열림상태: isLoginModalOpen,
      현재사용자: user
    });

    // 로그인 모달이 닫혔고, 인증 상태가 false에서 true로 변경되었으며, 모달 열기가 대기 중이면
    if (!isLoginModalOpen && !prevAuthRef.current && isAuthenticated && pendingModalOpen) {
      console.log("로그인 후 디테일 모달 열기 시도");
      
      // 모달 열기 대기 상태 초기화
      setPendingModalOpen(false);
      
      // 약간의 지연 후 모달 열기 (상태 업데이트 완료 보장)
      setTimeout(() => {
        console.log("디테일 모달 열기 실행");
        openModal({
          shelter_name: `${id}번 보호소`, 
          description: "견사 청소, 미용, 목욕, 산책, 밥주기 등" 
        });
      }, 300); // 시간을 300ms로 늘려 상태 업데이트 완료 보장
    }
    
    // 현재 인증 상태를 이전 상태로 업데이트
    prevAuthRef.current = isAuthenticated;
  }, [isLoginModalOpen, isAuthenticated, pendingModalOpen, id, user, openModal]);

  // 디버깅용: 디테일 모달 상태 변화 확인
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
    
    if (isAuthenticated) {
      // 인증된 상태면 바로 모달 열기
      console.log("인증된 상태에서 모달 열기");
      openModal({
        shelter_name: `${id}번 보호소`, 
        description: "견사 청소, 미용, 목욕, 산책, 밥주기 등" 
      });
    } else {
      // 인증되지 않은 상태면 모달 열기 플래그 설정 후 로그인 모달 열기
      console.log("비인증 상태에서 로그인 모달 열기");
      setPendingModalOpen(true);
      setPreviousPath(location.pathname);
      openLoginModal();
    }
  };

  // 임시 날짜 (서버에서 받아온 데이터라고 가정)
  const formattedDate = "2025년 3월 12일 (수요일)";

  return (
    <div className={styles["detail-container"]}>
      <div className={styles["back-button-container"]}>
        <button onClick={handleGoBack} className={styles["back-btn"]}>
          돌아가기
        </button>
      </div>
      
      <ShelterImageSwiper shelterId={id} />

      <div className={styles["detail-content"]}>
        {/* 왼쪽 - 보호소 정보 */}
        <div className={styles["shelter-info"]}>
          <h2>📌 상세 페이지 - {id}번 보호소</h2>
          <div className={styles["shelter-location"]}>
            <h3>보호소 위치: 서울특별시 / 동작구</h3>
            <p>주요 봉사 활동 내용:</p>
            <ul>
              <li>견사 청소</li>
              <li>미용</li>
              <li>목욕</li>
              <li>산책</li>
              <li>밥주기 등</li>
            </ul>
            <p>준비물: 물, 막 입을 수 있는 옷</p>
          </div>
        </div>

        {/* 오른쪽 - 봉사 시간 선택 */}
        <div className={styles["volunteer-time"]}>
          <div className={styles["date-selection"]}>
            <div className={styles["date-row"]}>
              <div className={styles["date-label"]}>선택 날짜:</div>
              <div className={styles["date-value"]}>{formattedDate}</div>
            </div>
            
            <div className={styles["time-label"]}>봉사시간:</div>
            <div className={styles["time-buttons"]}>
              <button
                className={selectedTime === "16:00 ~ 18:00" ? styles.selected : ""}
                onClick={() => handleTimeSelect("16:00 ~ 18:00")}
              >
                16:00 ~ 18:00
              </button>
              <button
                className={selectedTime === "19:00 ~ 21:00" ? styles.selected : ""}
                onClick={() => handleTimeSelect("19:00 ~ 21:00")}
              >
                19:00 ~ 21:00
              </button>
            </div>

            <div className={styles["note-container"]}>
              봉사 시간은 선택 후 변경이 어려우니 신중하게 선택해주세요.
            </div>
            
            <button
              className={styles["apply-btn"]}
              disabled={!selectedDate || !selectedTime}
              onClick={handleApplyClick}
            >
              신청하기
            </button>
          </div>
        </div>
      </div>

      {/* 디테일 모달이 필요할 때만 렌더링하도록 설정해볼 수도 있음 */}
      <DetailModal />
    </div>
  );
};

export default DetailPage;