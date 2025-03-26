// VolunteerApi.ts
import { axiosInstance } from "../api/axios/axiosInstance";
import { Dayjs } from "dayjs";

// 검색 파라미터 인터페이스
export interface SearchParams {
  locations?: string[];
  dateRange?: {
    startDate: Dayjs; 
    endDate: Dayjs;   
  } | null;
  timeRange?: {
    startTime: string;
    endTime: string;
  } | null;
}

// API 응답 데이터 인터페이스
export interface ApiRecruitment {
  id: number;
  shelter: number;
  shelter_name: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  supplies: string;
  status: string;
}

// 카드 데이터 인터페이스
export interface CardData {
  id: number;
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
}

// 봉사활동 등록 데이터 인터페이스
export interface CreateRecruitmentParams {
  shelter: number;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  supplies: string;
  status: string;
  
  // 선택적 필드
  end_date?: string;
  timeSlots?: { start_time: string; end_time: string }[];
  activities?: string[];
  maxParticipants?: number;
  description?: string;
}

// 이미지 업로드 응답 인터페이스
export interface UploadImageResponse {
  success: boolean;
  imageUrls?: string[];
  message?: string;
}

// 모든 봉사활동 모집 정보 가져오기
export const fetchAllRecruitments = async (): Promise<CardData[]> => {
  try {
    const response = await axiosInstance.get('/api/recruitments/');
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: "지역 정보", 
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음"
      }));
    }
    
    if (data.recruitments && Array.isArray(data.recruitments)) {
      return data.recruitments.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: "지역 정보",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음"
      }));
    }
    
    return [];
  } catch (error) {
    console.error('모집 정보를 불러오는 중 오류 발생:', error);
    return [];
  }
};

// 검색 조건에 맞는 봉사활동 모집 정보 가져오기
export const searchRecruitments = async (searchParams: SearchParams): Promise<CardData[]> => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams.locations && searchParams.locations.length > 0) {
      searchParams.locations.forEach(loc => {
        params.append('location', loc);
      });
    }
    
    if (searchParams.dateRange) {
      params.append('startDate', searchParams.dateRange.startDate.format('YYYY-MM-DD'));
      params.append('endDate', searchParams.dateRange.endDate.format('YYYY-MM-DD'));
    }
    
    if (searchParams.timeRange) {
      params.append('startTime', searchParams.timeRange.startTime);
      params.append('endTime', searchParams.timeRange.endTime);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get(`/api/recruitments/search/${queryString}`);
    
    if (Array.isArray(response.data)) {
      return response.data.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: "지역 정보", 
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음"
      }));
    }
    
    return [];
  } catch (error) {
    console.error('모집 정보 검색 중 오류 발생:', error);
    return [];
  }
};

// 봉사활동 모집 공고 생성
export const createRecruitment = async (data: CreateRecruitmentParams): Promise<{ id: number }> => {
  try {
    const response = await axiosInstance.post('/api/recruitments/create/', data);
    return response.data;
  } catch (error) {
    console.error('모집 공고 생성 실패:', error);
    throw error;
  }
};

// 봉사활동 이미지 업로드
export const uploadRecruitmentImages = async (recruitmentId: number, images: File[]): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    
    images.forEach((image, index) => {
      formData.append('images', image, `image_${index}`);
    });

    const response = await axiosInstance.post(`/api/recruitments/${recruitmentId}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};