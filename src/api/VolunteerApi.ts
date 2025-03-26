import { axiosInstance } from "../api/axios/axiosInstance";

export interface User {
  id: number;
  email: string;
  name: string;
  contact_number: string;
  profile_image: string | null;
}

export interface Recruitment {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string; 
}

export interface Shelter {
  id: number;
  name: string;
  region: string;
  address: string;
}

export interface VolunteerApplication {
  id: number;
  user: User;
  recruitment: Recruitment;
  shelter: Shelter;
  status: string; 
  rejected_reason: string | null;
  rating?: number; 
}

export interface RatingRequest {
  rating: number; 
}

export interface RatingResponse {
  id: number;
  rating: number;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
}

interface RecruitmentData {
  date: string;
  end_date: string;
  timeSlots: TimeSlot[];
  activities: string[];
  supplies: string[];
  maxParticipants: number;
  description: string;
}

interface RecruitmentResponse {
  id: number;
  recruitment: {
    id: number;
    date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

interface ImageUploadResponse {
  id: number;
  recruitment: number;
  image_url: string;
}

export const getVolunteerApplications = async (): Promise<VolunteerApplication[]> => {
  try {
    const response = await axiosInstance.get<VolunteerApplication[]>('/api/applications/');
    return response.data;
  } catch (error) {
    console.error('봉사 신청 목록 조회 오류:', error);
    throw error;
  }
};

export const submitVolunteerRating = async (historyId: number, rating: number): Promise<RatingResponse> => {
  try {
    const response = await axiosInstance.post<RatingResponse>(
      `/api/histories/${historyId}/rate/`, 
      { rating }
    );
    return response.data;
  } catch (error) {
    console.error('봉사활동 평가 제출 오류:', error);
    throw error;
  }
};

export const createRecruitment = async (data: RecruitmentData): Promise<RecruitmentResponse> => {
  const payload = {
    recruitment: {
      date: data.date,
      end_date: data.end_date,
      time_slots: data.timeSlots.map(slot => ({
        start_time: slot.start_time,
        end_time: slot.end_time
      })),
      activities: data.activities,
      supplies: data.supplies,
      max_participants: data.maxParticipants,
      description: data.description,
      status: "open"
    }
  };

  const response = await axiosInstance.post('/api/applications/', payload);
  return response.data;
};

export const uploadRecruitmentImages = async (
  recruitmentId: number, 
  images: File[]
): Promise<ImageUploadResponse[]> => {
  const formData = new FormData();
  
  images.forEach((image, index) => {
    formData.append(`image_${index}`, image);
  });

  const response = await axiosInstance.post(
    `/api/recruitments/${recruitmentId}/images/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

export const getRecruitment = async (recruitmentId: number) => {
  const response = await axiosInstance.get(`/api/recruitments/${recruitmentId}/`);
  return response.data;
};

export const getRecruitmentList = async (page: number = 1, size: number = 10) => {
  const response = await axiosInstance.get(`/api/recruitments/`, {
    params: {
      page,
      size
    }
  });
  return response.data;
};

export const updateRecruitment = async (recruitmentId: number, data: Partial<RecruitmentData>) => {
  const response = await axiosInstance.put(`/api/recruitments/${recruitmentId}/`, data);
  return response.data;
};

export const cancelRecruitment = async (recruitmentId: number) => {
  const response = await axiosInstance.patch(`/api/recruitments/${recruitmentId}/cancel/`, {});
  return response.data;
};

