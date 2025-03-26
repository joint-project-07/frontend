import React, { useState, useEffect } from "react";
import { useTabStore } from "../store/TabStore";
import styles from "../style/Mypage.module.scss";
import { TabType, usePaginationStore } from "../store/CurrentStore";
import "../style/Button.css";
import Modal from "../components/common/Modal";
import { useModalContext } from "../contexts/ModalContext";
import PasswordChangeModal from "../components/common/PasswordChangeModal";
import DeleteAccountModal from "../components/common/DeleteAccountModal";
import { ProfileManager } from "../components/common/ProfileManager";
import { useVolunteerStore } from "../store/volunteerStore";
import { VolunteerApplication } from "../api/VolunteerApi";
import StarRating from "../components/common/StarRating";

interface ListProps<T> {
  tabType: TabType;
  list: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage: string;
  isLoading: boolean;
}

const PaginatedList = <T extends { id: number }>({
  tabType,
  list,
  renderItem,
  emptyMessage,
  isLoading,
}: ListProps<T>) => {
  const {
    itemsPerPage,
    getPage,
    getTotalPages,
    nextPage,
    prevPage,
    setPage,
    setTotalPages,
  } = usePaginationStore();

  React.useEffect(() => {
    const total = Math.ceil(list.length / itemsPerPage);
    setTotalPages(tabType, total);
  }, [list, itemsPerPage, tabType, setTotalPages]);

  const currentPage = getPage(tabType);
  const totalPages = getTotalPages(tabType);

  const slicedList = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <div className={styles.loadingMessage}>로딩 중...</div>;
  }

  return (
    <section className={styles.listSection}>
      {slicedList.length > 0 ? (
        <>
          {slicedList.map(renderItem)}
          <div className={styles.pagination}>
            <button
              onClick={() => prevPage(tabType)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setPage(tabType, number)}
                  className={currentPage === number ? styles.activePage : ""}
                >
                  {number}
                </button>
              )
            )}
            <button
              onClick={() => nextPage(tabType)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <p>{emptyMessage}</p>
      )}
    </section>
  );
};

const ShelterApplicationsList: React.FC = () => {
  const { applications, isLoading, error, fetchApplications } = useVolunteerStore();
  
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '승인 대기';
      case 'approved': return '승인 완료';
      case 'rejected': return '반려';
      default: return status;
    }
  };

  return (
    <div className={styles.shelterListContainer}>
      <PaginatedList<VolunteerApplication>
        tabType="shelter"
        list={applications}
        isLoading={isLoading}
        renderItem={(application) => (
          <div key={application.id} className={styles.shelterCard}>
            <h3>{application.shelter.name}</h3>
            <p>예약 날짜: {application.recruitment.date}</p>
            <p>시간: {application.recruitment.start_time} - {application.recruitment.end_time}</p>
            <p>지역: {application.shelter.region}</p>
            <p>주소: {application.shelter.address}</p>
            <p
              className={
                application.status === "pending"
                  ? styles.statusPending
                  : application.status === "approved"
                  ? styles.statusComplete
                  : styles.statusRejected
              }
            >
              {formatStatusText(application.status)}
              {application.rejected_reason && ` (사유: ${application.rejected_reason})`}
            </p>
          </div>
        )}
        emptyMessage="보호소 신청 내역이 없습니다."
      />
    </div>
  );
};

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: VolunteerApplication | null;
  onSubmit: (applicationId: number, rating: number) => Promise<void>;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  application,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (application) {
      setRating(application.rating || 0);
      setIsSubmitted(!!application.rating);
    }
  }, [application]);

  const handleSubmit = async () => {
    if (!application) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(application.id, rating);
      setIsSubmitted(true);
    } catch (error) {
      console.error('평가 제출 오류:', error);
      alert('평가 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!application) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="만족도 조사">
      <div className="modal-content">
        {!isSubmitted ? (
          <div className={styles.surveyContainer}>
            <h3>만족도 조사</h3>
            <p>이번 봉사활동은 어떠셨나요?</p>
            <p>보호소: {application.shelter.name}</p>
            <p>봉사 날짜: {application.recruitment.date}</p>
            <StarRating rating={rating} setRating={setRating} />
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? '제출 중...' : '제출'}
            </button>
          </div>
        ) : (
          <div className={styles.surveyContainer}>
            <h3>제출 완료</h3>
            <p>
              보호소: {application.shelter.name} <br />
              봉사 날짜: {application.recruitment.date} <br />
              만족도 점수: ⭐ {rating}점 제출되었습니다!
            </p>
            <button className={styles.submitButton} onClick={onClose}>
              닫기
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const VolunteerHistoryList: React.FC = () => {
  const { isLoading, error, fetchApplications, submitRating, getApprovedApplications } = useVolunteerStore();
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const approvedApplications = getApprovedApplications();

  const openRatingModal = (application: VolunteerApplication) => {
    setSelectedApplication(application);
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedApplication(null);
  };

  const handleSubmitRating = async (applicationId: number, rating: number) => {
    await submitRating(applicationId, rating);
  };

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.volunteerListContainer}>
      <PaginatedList<VolunteerApplication>
        tabType="volunteer"
        list={approvedApplications}
        isLoading={isLoading}
        renderItem={(application) => (
          <div key={application.id} className={styles.volunteerCard}>
            <h3>{application.shelter.name}</h3>
            <p>봉사 날짜: {application.recruitment.date}</p>
            <p>시간: {application.recruitment.start_time} - {application.recruitment.end_time}</p>
            <p>지역: {application.shelter.region}</p>
            <p>주소: {application.shelter.address}</p>
            
            {application.rating ? (
              <div className={styles.ratingDisplay}>
                <p>만족도: ⭐ {application.rating}점</p>
                <button className={`button ${styles.ratingButton}`} onClick={() => openRatingModal(application)}>
                  평가 수정
                </button>
              </div>
            ) : (
              <button className={`button ${styles.ratingButton}`} onClick={() => openRatingModal(application)}>
                만족도 평가
              </button>
            )}
          </div>
        )}
        emptyMessage="봉사활동 이력이 없습니다."
      />
      
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={closeRatingModal}
        application={selectedApplication}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

const UserInfoTab: React.FC = () => {
  const { openPasswordModal } = useModalContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={styles.mypageContainer}>
      <main className={styles.mypageContent}>
        <ProfileManager />
        <section className={styles.infoSection}>
          <div className={styles.infoText}>
            펫모어핸즈와 함께해용💜
          </div>
          <button className={styles.infoButton} onClick={openPasswordModal}>
            비밀번호 변경
          </button>
          <button className={styles.infoButton} onClick={openDeleteModal}>
            회원 탈퇴
          </button>
          <PasswordChangeModal />
          <DeleteAccountModal 
            isOpen={isDeleteModalOpen} 
            onClose={closeDeleteModal} 
          />
        </section>
      </main>
    </div>
  );
};

const TabContent: React.FC = React.memo(() => {
  const { activeTab } = useTabStore();
  
  switch (activeTab) {
    case "info":
      return <UserInfoTab />;
    case "shelter":
      return <ShelterApplicationsList />;
    case "volunteer":
      return <VolunteerHistoryList />;
    default:
      return null;
  }
});

const MyPage: React.FC = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className={styles.mypageContainer}>
      <header className={styles.mypageHeader}>
        <button
          onClick={() => setActiveTab("info")}
          className={activeTab === "info" ? styles.activeTab : ""}
        >
          내 정보
        </button>
        <button
          onClick={() => setActiveTab("shelter")}
          className={activeTab === "shelter" ? styles.activeTab : ""}
        >
          보호소 승인 대기/완료
        </button>
        <button
          onClick={() => setActiveTab("volunteer")}
          className={activeTab === "volunteer" ? styles.activeTab : ""}
        >
          봉사활동 이력
        </button>
      </header>
      <main>
        <TabContent />
      </main>
    </div>
  );
};

export default MyPage;