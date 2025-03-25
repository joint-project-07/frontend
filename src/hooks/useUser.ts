import { useCallback, useState } from 'react';
import { userService } from '../api/services';
import { useAuth } from '../contexts/AuthContext'; // import 방식 수정
import { 
  UserProfile, 
  PasswordChangeRequest 
} from '../api/services/userService';

const useUser = () => {
  const { user, refreshUserInfo } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await userService.getProfile();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '프로필 조회 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: UserProfile) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      await refreshUserInfo();
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '프로필 업데이트 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserInfo]);

  const changePassword = useCallback(async (passwordData: PasswordChangeRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.changePassword(passwordData);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '비밀번호 변경 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadProfileImage = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await userService.uploadProfileImage(imageFile);
      await refreshUserInfo();
      return result.imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '프로필 이미지 업로드 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserInfo]);

  const deleteAccount = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.deleteAccount(password);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '회원 탈퇴 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNotificationSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await userService.getNotificationSettings();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '알림 설정 조회 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateNotificationSettings = useCallback(async (settings: { email: boolean; push: boolean }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.updateNotificationSettings(settings);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '알림 설정 업데이트 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    getProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    deleteAccount,
    getNotificationSettings,
    updateNotificationSettings
  };
};

export default useUser;