import React from "react";
import { useParams } from "react-router-dom";
import "../style/DetailPage.css";
import useStore from "../store/Detail";
import { useModalStore } from "../store/ModalStore"; // ✅ Zustand 모달 상태 가져오기
import DetailModal from "../components/common/DetailModal";

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const selectedDate = useStore((state) => state.selectedDate);
  const selectedTime = useStore((state) => state.selectedTime);
  const setSelectedTime = useStore((state) => state.setSelectedTime);
  const { openModal } = useModalStore(); // ✅ Zustand 모달 상태 사용

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <>
      <main className="detail-content">
        <h2>📌 상세 페이지 - {id}번 보호소</h2>
        <img
          src="/assets/main-image.png"
          alt="메인 이미지"
          className="detail-image"
        />

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

        <section className="volunteer-time">
          <h3>선택 날짜:</h3>
          <input
            type="date"
            value={selectedDate}
            readOnly
            className="date-picker"
          />

          <h3>봉사시간:</h3>
          <div className="time-buttons">
            <button
              className={selectedTime === "16:00 ~ 18:00" ? "selected" : ""}
              onClick={() => handleTimeSelect("16:00 ~ 18:00")}
            >
              16:00 ~ 18:00
            </button>
            <button
              className={selectedTime === "19:00 ~ 21:00" ? "selected" : ""}
              onClick={() => handleTimeSelect("19:00 ~ 21:00")}
            >
              19:00 ~ 21:00
            </button>
          </div>

          {/* ✅ 신청하기 버튼 클릭 시 모달 오픈 */}
          <button
            className="apply-btn"
            disabled={!selectedDate || !selectedTime}
            onClick={() => openModal({
              shelter_name: `${id}번 보호소`, 
              description: "견사 청소, 미용, 목욕, 산책, 밥주기 등" 
            })}
          >
            신청하기
          </button>
        </section>
      </main>

      {/* ✅ 모달 추가 */}
      <DetailModal />
    </>
  );
};

export default DetailPage;
