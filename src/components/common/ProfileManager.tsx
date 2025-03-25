import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInfo, uploadProfileImage, deleteProfileImage, getProfileImageUrl } from "../../api/userApi";
import styles from "../../style/Mypage.module.scss";
import defaultProfileImg from "../../assets/profile.png";

// 사용자 이름 표시 컴포넌트
export const UserNameDisplay: React.FC<{ userName: string; loading: boolean }> = React.memo(
  ({ userName, loading }) => {
    return (
      <div className={styles.infoText} style={{ fontWeight: 'bold', marginBottom: '15px' }}>
        {loading ? "로딩중..." : (userName ? `${userName} 님` : "사용자명")}
      </div>
    );
  }
);

// 프로필 이미지 컴포넌트
export const ProfileImage: React.FC<{
  hasImage: boolean;
  loading: boolean;
  onClick: () => void;
}> = React.memo(({ hasImage, loading, onClick }) => {
  // 프로필 이미지 URL 결정
  const imageUrl = hasImage ? getProfileImageUrl() : defaultProfileImg;

  return (
    <div
      className={styles.profileImage}
      onClick={onClick}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {loading && <div className={styles.loadingOverlay}>로딩중...</div>}
    </div>
  );
});

// 프로필 이미지 관리 컴포넌트
export const ProfileManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasProfileImage, setHasProfileImage] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUserData } = useAuth();
  
  // 사용자 정보 로딩
  const loadUserInfo = useCallback(async () => {
    setLoading(true);
    
    try {
      // 로컬 상태에서 먼저 체크
      if (user) {
        setUserName(user.name || "");
        setHasProfileImage(!!user.profile_image);
      }
      
      // API에서 최신 정보 가져오기
      const userDetails = await getUserInfo();
      if (userDetails) {
        setUserName(userDetails.name || "");
        setHasProfileImage(!!userDetails.profile_image);
        
        if (updateUserData) {
          updateUserData({
            ...userDetails
          });
        }
      }
    } catch (error) {
      console.error('사용자 정보 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [user, updateUserData]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  // 프로필 이미지 클릭 핸들러
  const handleProfileClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // 파일 선택 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      setLoading(true);
      
      // 이미지 업로드
      await uploadProfileImage(file);
      
      // 상태 업데이트 - 추가 API 호출 없이 바로 상태 변경
      setHasProfileImage(true);
      
      // 필요한 경우에만 사용자 정보 갱신
      if (updateUserData) {
        updateUserData({
          ...user,
          profile_image: 'updated' // 실제 URL이 아니라 상태만 변경
        });
      }
      
      alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 업로드 오류:', error);
      alert('프로필 이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 삭제
  const handleDeleteProfileImage = useCallback(async () => {
    try {
      setLoading(true);
      
      // 이미지 삭제 API 호출
      await deleteProfileImage();
      
      // 상태 업데이트
      setHasProfileImage(false);
      
      // 사용자 정보 다시 가져오기
      const userDetails = await getUserInfo();
      if (userDetails && updateUserData) {
        updateUserData({
          ...userDetails
        });
      }
      
      alert('프로필 이미지가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 삭제 오류:', error);
      alert('프로필 이미지 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [updateUserData]);

  return (
    <section className={styles.profileSection}>
      {/* 프로필 이미지 */}
      <ProfileImage 
        hasImage={hasProfileImage}
        loading={loading}
        onClick={handleProfileClick}
      />
      
      {/* 파일 입력 (숨김) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {/* 프로필 버튼 그룹 */}
      <div className={styles.profileButtonGroup}>
        <button 
          className={styles.profileEditBtn}
          onClick={handleProfileClick}
          disabled={loading}
        >
          프로필 변경
        </button>
        {hasProfileImage && (
          <button 
            className={styles.profileDeleteBtn}
            onClick={handleDeleteProfileImage}
            disabled={loading}
          >
            프로필 삭제
          </button>
        )}
      </div>
      
      {/* 사용자 이름 표시 */}
      <UserNameDisplay userName={userName} loading={loading} />
    </section>
  );
};