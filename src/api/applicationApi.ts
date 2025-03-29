import { axiosInstance } from "../api/axios/axiosInstance";

// Type definitions
export interface Volunteer {
  id: number;
  name: string;
  phone: string;
  status: "승인" | "반려" | "대기";
  attendance?: "참석" | "불참석";
  email?: string;
  contact_number?: string;
  profile_image?: string;
}

export interface Institution {
  id: number;
  name: string;
  region: string;
  address: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface RecruitmentData {
  date: string;
  end_date: string;
  timeSlots: TimeSlot[];
  activities: string[];
  supplies: string[];
  maxParticipants: number;
  description: string;
}

export interface RecruitmentResponse {
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

export interface ImageUploadResponse {
  id: number;
  recruitment: number;
  image_url: string;
}

export interface RecruitmentDetail {
  id: number;
  date: string;
  end_date: string;
  status: string;
  activities: string[];
  supplies: string[];
  max_participants: number;
  description: string;
  images: string[];
  shelter: Institution;
  shelter_name?: string;
  type?: string;
  time_slots: TimeSlot[];
}

export interface ApplicationData {
  recruitment: number;
  shelter: number;
}

// API Functions

// 봉사 신청 승인 API
export const approveApplication = async (applicationId: number) => {
  const payload = {
    status: "pending"
  };
  const response = await axiosInstance.post(`/api/applications/${applicationId}/approved/`, payload);
  return response.data;
};

// 봉사 신청 거절 API
export const rejectApplication = async (applicationId: number, rejectedReason: string) => {
  const payload = {
    rejected_reason: rejectedReason
  };
  const response = await axiosInstance.post(`/api/applications/${applicationId}/rejected/`, payload);
  return response.data;
};

// 봉사 참석 완료 API
export const markAsAttended = async (applicationId: number) => {
  const payload = {
    status: "pending"
  };
  const response = await axiosInstance.post(`/api/applications/${applicationId}/attended/`, payload);
  return response.data;
};

// 봉사 불참 처리 API
export const markAsAbsent = async (applicationId: number) => {
  const payload = {
    status: "pending"
  };
  const response = await axiosInstance.post(`/api/applications/${applicationId}/absence/`, payload);
  return response.data;
};

// 봉사 모집 조회 API
export const getRecruitment = async (recruitmentId: number): Promise<RecruitmentDetail> => {
  const response = await axiosInstance.get(`/api/recruitments/${recruitmentId}/`);
  return response.data;
};

// 봉사 모집 목록 조회 API
export const getRecruitmentList = async (page: number = 1, size: number = 10) => {
  const response = await axiosInstance.get(`/api/recruitments/`, {
    params: {
      page,
      size
    }
  });
  return response.data;
};

// 봉사 모집 생성 API
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

// 이미지 업로드 API
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

// 봉사 모집 수정 API
export const updateRecruitment = async (recruitmentId: number, data: Partial<RecruitmentData>) => {
  const response = await axiosInstance.put(`/api/recruitments/${recruitmentId}/`, data);
  return response.data;
};

// 봉사 모집 취소 API
export const cancelRecruitment = async (recruitmentId: number) => {
  const response = await axiosInstance.patch(`/api/recruitments/${recruitmentId}/cancel/`, {});
  return response.data;
};

// 특정 봉사 모집에 신청한 지원자 목록 조회
export const getRecruitmentApplicants = async (recruitmentId: number) => {
  const response = await axiosInstance.get(`/api/recruitments/${recruitmentId}/applicants/`);
  return response.data;
};

// 봉사 신청 API
export const applyForVolunteer = async (data: ApplicationData) => {
  const response = await axiosInstance.post('/api/applications/', {
    recruitment: data.recruitment,
    shelter: data.shelter
  });
  return response.data;
};