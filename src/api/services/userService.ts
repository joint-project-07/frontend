import axiosInstance from '../axios/axiosInstance';

export interface UserProfile {
  name: string;
  bio?: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData: UserProfile): Promise<UserProfile> => {
    const response = await axiosInstance.put<UserProfile>('/users/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: PasswordChangeRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/users/password', passwordData);
    return response.data;
  },

  uploadProfileImage: async (imageFile: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post<{ imageUrl: string }>('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteAccount: async (password: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/users/delete', { password });
    return response.data;
  },

  getNotificationSettings: async (): Promise<{ email: boolean; push: boolean }> => {
    const response = await axiosInstance.get<{ email: boolean; push: boolean }>('/users/notifications/settings');
    return response.data;
  },

  updateNotificationSettings: async (settings: { email: boolean; push: boolean }): Promise<{ message: string }> => {
    const response = await axiosInstance.put<{ message: string }>('/users/notifications/settings', settings);
    return response.data;
  },

  getUserActivities: async (page = 1, limit = 10): Promise<{
    activities: Array<{ id: string; type: string; content: string; createdAt: string }>;
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await axiosInstance.get<{
      activities: Array<{ id: string; type: string; content: string; createdAt: string }>;
      total: number;
      page: number;
      limit: number;
    }>(`/users/activities?page=${page}&limit=${limit}`);
    return response.data;
  }
};

export default userService;