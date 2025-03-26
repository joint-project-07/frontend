import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInfo, uploadProfileImage, deleteProfileImage } from "../../api/userApi";
import styles from "../../style/Mypage.module.scss";
import defaultProfileImg from "../../assets/profile.png";

interface UserNameDisplayProps {
  userName: string;
  loading: boolean;
}

export const UserNameDisplay: React.FC<UserNameDisplayProps> = React.memo(
  ({ userName, loading }) => {
    return (
      <div className={styles.infoText} style={{ fontWeight: 'bold', marginBottom: '15px' }}>
        {loading ? "로딩중..." : (userName ? `${userName} 님` : "사용자명")}
      </div>
    );
  }
);

interface ProfileImageProps {
  imageUrl: string | null;
  loading: boolean;
  onClick: () => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = React.memo(
  ({ imageUrl, loading, onClick }) => {
    const isValidImageUrl = imageUrl && imageUrl.trim().length > 0;
    const displayUrl = isValidImageUrl ? imageUrl : defaultProfileImg;

    return (
      <div className={styles.profileImage} onClick={onClick}>
        <img 
          src={displayUrl} 
          alt="프로필 이미지" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '50%'
          }} 
          onError={(e) => {
            e.currentTarget.src = defaultProfileImg;
          }}
        />
        {loading && <div className={styles.loadingOverlay}>로딩중...</div>}
      </div>
    );
  }
);

export const ProfileManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userInfo = await getUserInfo();
        
        setUserName(userInfo.name || "");
        setImageUrl(userInfo.profile_image || null);
        updateUserData(userInfo);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleProfileClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    setLoading(true);

    try {
      const response = await uploadProfileImage(file);
      
      URL.revokeObjectURL(previewUrl);
      
      if (response && typeof response === 'object' && 'image_url' in response) {
        const newImageUrl = response.image_url as string;
        setImageUrl(newImageUrl);
        updateUserData({ profile_image: newImageUrl });
      }
      
      alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setImageUrl(user?.profile_image || null);
      
      alert('프로필 이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProfileImage = async (): Promise<void> => {
    if (!imageUrl) return;
    
    setLoading(true);
    
    try {
      await deleteProfileImage();
      
      setImageUrl(null);
      updateUserData({ profile_image: null });
      
      alert('프로필 이미지가 성공적으로 삭제되었습니다.');
    } catch (error) {
      alert('프로필 이미지 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserName(user.name || "");
      
      if (user.profile_image === null) {
        setImageUrl(null);
      } else if (user.profile_image) {
        setImageUrl(user.profile_image);
      }
    }
  }, [user]);

  return (
    <section className={styles.profileSection}>
      <ProfileImage 
        imageUrl={imageUrl}
        loading={loading}
        onClick={handleProfileClick}
      />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className={styles.profileButtonGroup}>
        <button 
          className={styles.profileEditBtn}
          onClick={handleProfileClick}
          disabled={loading}
        >
          프로필 변경
        </button>
        {imageUrl && (
          <button 
            className={styles.profileDeleteBtn}
            onClick={handleDeleteProfileImage}
            disabled={loading}
          >
            프로필 삭제
          </button>
        )}
      </div>
      
      <UserNameDisplay userName={userName} loading={loading} />
    </section>
  );
};