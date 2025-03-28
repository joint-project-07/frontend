import dogImage from "../../assets/dog-image.png";
import useModalStore from "../../store/ModalStore";
import styles from "../../style/DetailModal.module.scss";

const DetailModal: React.FC = () => {
  const { isOpen, closeModal } = useModalStore();

  if (!isOpen) return null; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>
          반가워요! 우리 곧 만나요<span>💖</span>
        </h2>
        <img src={dogImage} className={styles.modalImage} alt="강아지 이미지" />
        <p className={styles.modalText}>
          • 보호소 승인 후 최종 확정됩니다.
          <br />• 1~2일 이내 마이페이지에서 신청 내역을 확인할 수 있습니다.
          <br />• 승인 완료 후 변경/취소는 보호소 정책에 따라 진행됩니다.
        </p>
        <div className={styles.modalButtons}>
          <button
            className={`${styles.modalButton} ${styles.cancel}`}
            onClick={closeModal}
          >
            돌아가기
          </button>
          <button className={`${styles.modalButton} ${styles.apply}`}>
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
