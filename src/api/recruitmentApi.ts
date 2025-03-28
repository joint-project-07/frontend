import { axiosInstance } from "./axios/axiosInstance";
import { Dayjs } from "dayjs";

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

export interface CardData {
  id: number;
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
  shelter: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  contact_number: string;
  profile_image: string;
}

export interface RecruitmentDetails {
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

export interface CreateRecruitmentParams {
  id: number;
  user: User;
  recruitment: RecruitmentDetails;
  shelter: Shelter;
  status: string;
  rejected_reason: string;
  
  supplies?: string;
  description?: string;
  activities?: string[];
  end_date?: string;
  maxParticipants?: number;
  timeSlots?: Array<{
    start_time: string;
    end_time: string;
  }>;
}

export interface UploadImageResponse {
  success: boolean;
  imageUrls?: string[];
  message?: string;
}

export const fetchRecruitmentDetail = async (id: string | undefined) => {
  try {
    if (!id) {
      throw new Error('모집공고 ID가 제공되지 않았습니다.');
    }
    
    const response = await axiosInstance.get(`/api/recruitments/${id}/`);
    
    // API 응답이 recruitment 객체로 감싸져 있는 경우
    if (response.data && response.data.recruitment) {
      console.log('중첩된 recruitment 데이터 발견:', response.data.recruitment);
      return response.data.recruitment;
    }
    
    // 감싸져 있지 않은 경우 원래 데이터 반환
    return response.data;
  } catch (error) {
    console.error('모집공고 상세 정보 조회 실패:', error);
    throw error;
  }
};
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
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    if (data.recruitments && Array.isArray(data.recruitments)) {
      return data.recruitments.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: "지역 정보",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    return [];
  } catch (error) {
    console.error('모집 정보를 불러오는 중 오류 발생:', error);
    return [];
  }
};

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
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    return [];
  } catch (error) {
    console.error('모집 정보 검색 중 오류 발생:', error);
    return [];
  }
};

export const createRecruitment = async (data: CreateRecruitmentParams): Promise<{ id: number }> => {
  try {
    const requestData = {
      shelter: data.shelter.id,
      date: data.recruitment.date,
      start_time: data.recruitment.start_time,
      end_time: data.recruitment.end_time,
      type: "cleaning", 
      supplies: data.supplies || '',
      status: data.recruitment.status || 'open'
    };
    
    const response = await axiosInstance.post('/api/recruitments/create/', requestData);
    return response.data;
  } catch (error) {
    console.error('모집 공고 생성 실패:', error);
    throw error;
  }
};

export const uploadRecruitmentImages = async (recruitmentId: number, images: File[]): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    
    images.forEach((image, index) => {
      formData.append('images', image, `image_${index}`);
    });

    const response = await axiosInstance.post(`/api/recruitments/${recruitmentId}/images/`, formData);

    return response.data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

export const applyForVolunteer = async (
  recruitmentId: string | undefined, 
  selectedTime: string,
  userId: string | undefined
) => {
  try {
    if (!recruitmentId || !userId) {
      throw new Error('필수 정보가 누락되었습니다.');
    }
    
    const [start_time, end_time] = selectedTime.split(' ~ ');
    
    const response = await axiosInstance.post(`/api/applications/`, {
      recruitment_id: recruitmentId,
      user_id: userId,
      start_time,
      end_time
    });
    
    return response.data;
  } catch (error) {
    console.error('봉사 신청 실패:', error);
    throw error;
  }
};