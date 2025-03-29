import React, { useState } from "react";
import dogImage from "../../assets/dog-image.png";
import useModalStore from "../../store/ModalStore";
import styles from "../../style/DetailModal.module.scss";
import { applyForVolunteer } from "../../api/applicationApi";

const DetailModal: React.FC = () => {
  const { isOpen, closeModal, modalData } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleApply = async () => {
    const recruitmentId = modalData?.recruitmentId;
    const shelterId = modalData?.shelterId;

    if (!recruitmentId || !shelterId) {
      setSubmitError("필요한 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await applyForVolunteer({
        recruitment: recruitmentId,
        shelter: shelterId
      });

      console.log("봉사 신청 성공:", response);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        closeModal();
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error("봉사 신청 실패:", error);
      setSubmitError("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>
          반가워요! 우리 곧 만나요<span>💖</span>
        </h2>
        <img src={dogImage} className={styles.modalImage} alt="강아지 이미지" />
        
        {submitSuccess ? (
          <p className={styles.successMessage}>
            신청이 완료되었습니다! 곧 마이페이지에서 확인할 수 있습니다.
          </p>
        ) : (
          <p className={styles.modalText}>
            • 보호소 승인 후 최종 확정됩니다.
            <br />• 1~2일 이내 마이페이지에서 신청 내역을 확인할 수 있습니다.
            <br />• 승인 완료 후 변경/취소는 보호소 정책에 따라 진행됩니다.
          </p>
        )}
        
        {submitError && (
          <p className={styles.errorMessage}>{submitError}</p>
        )}
        
        <div className={styles.modalButtons}>
          <button
            className={`${styles.modalButton} ${styles.cancel}`}
            onClick={closeModal}
            disabled={isSubmitting}
          >
            돌아가기
          </button>
          
          <button 
            className={`${styles.modalButton} ${styles.apply}`}
            onClick={handleApply}
            disabled={isSubmitting || submitSuccess}
          >
            {isSubmitting ? "신청 중..." : "신청하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;