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
  shelter_region: string; 
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
  
  type?: string;
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

const convertTypeToCode = (type: string): string => {
  const typeMap: Record<string, string> = {
    "시설 청소": "cleaning",
    "동물 목욕": "bathing",
    "동물 산책": "walking",
    "사료 급여": "feeding",
    "놀이 활동": "playing"
  };
  
  return typeMap[type] || type;
};

export const fetchRecruitmentDetail = async (id: string | undefined) => {
  try {
    if (!id) {
      throw new Error('모집공고 ID가 제공되지 않았습니다.');
    }
    
    const response = await axiosInstance.get(`/api/recruitments/${id}/`);
    
    if (response.data && response.data.recruitment) {
      console.log('중첩된 recruitment 데이터 발견:', response.data.recruitment);
      return response.data.recruitment;
    }
    
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
        region: item.shelter_region || "지역 정보 없음",
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
        region: item.shelter_region || "지역 정보 없음",
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
      // shelter_region 파라미터만 사용
      params.append('shelter_region', searchParams.locations.join(','));
    }
    
    if (searchParams.dateRange) {
      params.append('start_date', searchParams.dateRange.startDate.format('YYYY-MM-DD'));
      params.append('end_date', searchParams.dateRange.endDate.format('YYYY-MM-DD'));
    }
    
    if (searchParams.timeRange) {
      params.append('time', searchParams.timeRange.startTime);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get(`/api/recruitments/search/${queryString}`);
    
    console.log('검색 API 응답:', response.data);
    
    // 응답 구조 확인
    if (response.data && response.data.recruitments && Array.isArray(response.data.recruitments)) {
      // 중첩된 구조인 경우 (response.data.recruitments 배열)
      console.log('중첩 구조 발견:', response.data.recruitments.length);
      return response.data.recruitments.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    } else if (Array.isArray(response.data)) {
      // 중첩되지 않은 배열인 경우 (직접 배열인 response.data)
      console.log('일반 배열 구조 발견:', response.data.length);
      return response.data.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    // 다른 구조일 경우도 처리
    if (response.data && typeof response.data === 'object') {
      console.log('다른 구조 발견, 키:', Object.keys(response.data));
      // 응답에서 배열 형태의 데이터 찾기
      for (const key in response.data) {
        if (Array.isArray(response.data[key])) {
          console.log(`${key} 배열 발견:`, response.data[key].length);
          return response.data[key].map((item: ApiRecruitment) => ({
            id: item.id,
            image: "https://via.placeholder.com/300x200", 
            title: item.shelter_name || "봉사 센터",
            region: item.shelter_region || "지역 정보 없음",
            date: item.date || "날짜 정보 없음",
            volunteerwork: item.type || "봉사 정보 없음",
            shelter: item.shelter 
          }));
        }
      }
    }
    
    console.log('처리할 수 있는 구조를 찾지 못함');
    return [];
  } catch (error) {
    console.error('모집 정보 검색 중 오류 발생:', error);
    return [];
  }
};

export const createRecruitment = async (data: CreateRecruitmentParams, images?: File[]): Promise<{ id: number }> => {
  try {
    const formData = new FormData();
    
    formData.append('shelter', data.shelter.id.toString());
    formData.append('date', data.recruitment.date);
    formData.append('start_time', data.recruitment.start_time);
    formData.append('end_time', data.recruitment.end_time);
    formData.append('type', data.type || '');

    if (data.type) {
      const typeCode = convertTypeToCode(data.type);
      formData.append('type', typeCode);
    } else {
      formData.append('type', '');
    }

    formData.append('supplies', data.supplies || '');
    formData.append('status', data.recruitment.status || 'open');
    
    console.log("이미지 개수:", images?.length);

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('image', image, `image_${index}`);
      });
    }

    const response = await axiosInstance.post('/api/recruitments/create/', formData);
    return response.data;
  } catch (error) {
    console.error('모집 공고 생성 실패:', error);
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

export const fetchInstitutionRecruitments = async (): Promise<CardData[]> => {
  try {
    const response = await axiosInstance.get(`/api/recruitments/mylist/`);
    
    if (Array.isArray(response.data)) {
      return response.data.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    if (response.data.recruitments && Array.isArray(response.data.recruitments)) {
      return response.data.recruitments.map((item: ApiRecruitment) => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    return [];
  } catch (error) {
    console.error('기관 모집 정보를 불러오는 중 오류 발생:', error);
    return [];
  }
};