import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTabStore } from "../store/TabStore";
import { useShelterStore } from "../store/ShelterStore";
import styles from "../style/Mypage.module.scss";
import { TabType, usePaginationStore } from "../store/CurrentStore";
import "../style/Button.css";
import Modal from "../components/common/Modal";
import useModalStore from "../store/modalStore";
import StarRating from "../components/common/StarRating";
import PasswordChangeModal from "../components/common/PasswordChangeModal";
import DeleteAccountModal from "../components/common/DeleteAccountModal";
import { useModalContext } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile, getUserInfo } from "../api/userApi";

interface ShelterItem {
  application_id: number;
  shelter_name: string;
  date: string;
  description: string;
  status: string;
}

interface ListProps {
  tabType: TabType;
  list: ShelterItem[];
  renderItem: (item: ShelterItem) => React.ReactNode;
  emptyMessage: string;
}

const PaginatedList: React.FC<ListProps> = ({
  tabType,
  list,
  renderItem,
  emptyMessage,
}) => {
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

const ShelterList: React.FC = () => {
  const { shelterList } = useShelterStore();

  return (
    <div className={styles.shelterListContainer}>
      <PaginatedList
        tabType="shelter"
        list={shelterList}
        renderItem={(item) => (
          <div key={item.application_id} className={styles.shelterCard}>
            <h3>{item.shelter_name}</h3>
            <p>예약 날짜: {item.date}</p>
            <p>봉사 활동: {item.description}</p>
            <p
              className={
                item.status === "pending"
                  ? styles.statusPending
                  : styles.statusComplete
              }
            >
              {item.status === "pending" ? "승인 대기" : "승인 완료"}
            </p>
          </div>
        )}
        emptyMessage="예약 내역이 없습니다."
      />
    </div>
  );
};

const VolunteerHistory: React.FC = () => {
  const { shelterList } = useShelterStore();
  const {
    isOpen,
    selectedShelter,
    openModal,
    closeModal,
    rating,
    setRating,
    resetSurvey,
    isSubmitted,
    setSubmitted,
    submittedRating,
    setSubmittedRating,
  } = useModalStore();

  const handleSubmit = () => {
    setSubmittedRating(rating); 
    setSubmitted(true); 
    resetSurvey(); 
  };

  const handleClose = () => {
    closeModal();
    setSubmitted(false);
    setSubmittedRating(0); 
  };

  return (
    <div className={styles.volunteerListContainer}>
      <PaginatedList
        list={shelterList}
        renderItem={(item) => (
          <div key={item.application_id} className={styles.volunteerCard}>
            <h3>{item.shelter_name}</h3>
            <p>예약 날짜: {item.date}</p>
            <p>봉사 활동: {item.description}</p>
            <button className="button" onClick={() => openModal(item)}>
              만족도 조사
            </button>
          </div>
        )}
        emptyMessage="봉사활동 이력이 없습니다."
        tabType={"shelter"}
      />
      <Modal isOpen={isOpen} onClose={closeModal} title="만족도 조사">
        <div className="modal-content">
          {!isSubmitted ? (
            <div className={styles.surveyContainer}>
              <h3>만족도 조사</h3>
              <p>이번 봉사활동은 어떠셨나요?</p>
              <StarRating rating={rating} setRating={setRating} />
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={rating === 0}
              >
                제출
              </button>
            </div>
          ) : (
            <div className={styles.surveyContainer}>
              <h3>제출 완료</h3>
              <p>
                보호소: {selectedShelter?.shelter_name} <br />
                만족도 점수: ⭐ {submittedRating}점 제출되었습니다!
              </p>
              <button className={styles.submitButton} onClick={handleClose}>
                닫기
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const UserNameDisplay = React.memo(({ userName, loading }: { userName: string, loading: boolean }) => {
  return (
    <div className={styles.infoText} style={{ fontWeight: 'bold', marginBottom: '15px' }}>
      {loading ? "로딩중..." : (userName ? `${userName} 님` : "사용자명")}
    </div>
  );
});

const TabContent: React.FC = React.memo(() => {
  const { activeTab } = useTabStore();
  const { openPasswordModal } = useModalContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUserData } = useAuth();
  const hasLoadedRef = useRef<boolean>(false);

  const loadUserInfo = useCallback(async () => {
    if (activeTab === "info" && !hasLoadedRef.current) {
      setLoading(true);
      hasLoadedRef.current = true;
      
      try {
        if (user && user.name) {
          setUserName(user.name);
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const localData = JSON.parse(storedUser);
              const localUserData = localData.user || localData;
              if (localUserData.name) {
                setUserName(localUserData.name);
              }
            } catch (error) {
              console.error('Local storage parsing error:', error);
            }
          }
        }
        
        const userDetails = await getUserInfo();
        if (userDetails) {
          setUserName(userDetails.name || "");
          
          if (userDetails && updateUserData) {
            updateUserData({
              ...userDetails
            });
          }
        }
      } catch (error) {
        console.error('User info fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [activeTab, user, updateUserData]);

  useEffect(() => {
    loadUserInfo();
    
    return () => {
      if (activeTab !== "info") {
        hasLoadedRef.current = false;
      }
    };
  }, [activeTab, loadUserInfo]);

  const handleProfileClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', userName);
      formData.append('profile_image', file);

      await updateProfile({
        name: userName,
        profile_image: file
      });
      
      const userDetails = await getUserInfo();
      if (userDetails) {
        setUserName(userDetails.name || "");
        
        if (userDetails && updateUserData) {
          updateUserData({
            ...userDetails
          });
        }
      }
      
      alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error(error);
      alert('프로필 이미지 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userName, updateUserData]);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  switch (activeTab) {
    case "info":
      return (
        <div className={styles.mypageContainer}>
          <main className={styles.mypageContent}>
            <section className={styles.profileSection}>
              <div className={styles.profileImage} onClick={handleProfileClick}>
                {loading && <div className={styles.loadingOverlay}>로딩중...</div>}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleFileChange}
              />
              <button 
                className={styles.profileEditBtn}
                onClick={handleProfileClick}
                disabled={loading}
              >
                프로필 변경
              </button>
            </section>
            <section className={styles.infoSection}>
              <UserNameDisplay userName={userName} loading={loading} />
              
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
    case "shelter":
      return <ShelterList />;
    case "volunteer":
      return <VolunteerHistory />;
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