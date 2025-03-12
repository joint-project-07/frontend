import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../style/DetailPage.module.scss"; 
import useStore from "../store/Detail";
import useModalStore from "../store/ModalStore";
import DetailModal from "../components/common/DetailModal";
import ShelterImageSwiper from "../components/common/ShelterImageSwiper";

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedDate = useStore((state) => state.selectedDate);
  const selectedTime = useStore((state) => state.selectedTime);
  const setSelectedTime = useStore((state) => state.setSelectedTime);
  const { openModal } = useModalStore();

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleGoBack = () => {
    navigate(-1);
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
              onClick={() => openModal({
                shelter_name: `${id}번 보호소`, 
                description: "견사 청소, 미용, 목욕, 산책, 밥주기 등" 
              })}
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