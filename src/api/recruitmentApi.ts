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
  images?: {
    id: number;
    image_url: string;
  }[];
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

export interface Volunteer {
  id: number;
  name: string;
  phone: string;
  status: string;
  attendance?: string;
  profile_image?: string;
}

export interface Applicant {
  id: number;
  user_id: number;
  name: string;
  phone?: string;
  email?: string;
  status: string;
  attendance?: string;
  profile_image?: string;
  rejected_reason?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  recruitment?: T;
  applicants?: T[];
  recruitments?: T[];
  [key: string]: unknown;
}

export const convertTypeToCode = (type: string): string => {
  const typeMap: Record<string, string> = {
    "시설 청소": "cleaning",
    "동물 목욕": "bathing",
    "동물 산책": "walking",
    "사료 급여": "feeding",
    "놀이 활동": "playing"
  };
  
  return typeMap[type] || type;
};

export const convertCodeToType = (code: string): string => {
  const codeMap: Record<string, string> = {
    "cleaning": "시설 청소",
    "bathing": "동물 목욕",
    "walking": "동물 산책",
    "feeding": "사료 급여",
    "playing": "놀이 활동"
  };
  
  return codeMap[code] || code; 
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchRecruitmentDetail = async (id: string | undefined): Promise<any> => {
  try {
    if (!id) {
      throw new Error('모집공고 ID가 제공되지 않았습니다.');
    }
    
    const response = await axiosInstance.get(`/api/recruitments/${id}/`);
    
    console.log('API 응답:', response.data);
    
    if (response.data && response.data.recruitment) {
      return response.data.recruitment;
    }
    
    return response.data;
  } catch (error) {
    console.error('모집공고 상세 정보 조회 실패:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRecruitmentApplicants = async (recruitmentId: number): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`/api/recruitments/${recruitmentId}/applicants/`);
    
    console.log('API 응답 데이터:', response.data);
    
    if (response.data && response.data.applicants) {
      return response.data.applicants;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.log('처리할 수 없는 응답 구조:', response.data);
    return [];
  } catch (error) {
    console.error('지원자 목록 조회 중 오류 발생:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const approveApplication = async (applicationId: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/api/applications/${applicationId}/approve/`);
    return response.data;
  } catch (error) {
    console.error('신청 승인 중 오류 발생:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rejectApplication = async (applicationId: number, reason: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/api/applications/${applicationId}/reject/`, {
      reason: reason
    });
    return response.data;
  } catch (error) {
    console.error('신청 반려 중 오류 발생:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const markAsAttended = async (applicationId: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/api/applications/${applicationId}/attended/`);
    return response.data;
  } catch (error) {
    console.error('참석 처리 중 오류 발생:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const markAsAbsent = async (applicationId: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/api/applications/${applicationId}/absent/`);
    return response.data;
  } catch (error) {
    console.error('불참석 처리 중 오류 발생:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRecruitment = async (recruitmentId: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/api/recruitments/${recruitmentId}/`);
    return response.data;
  } catch (error) {
    console.error('모집 공고 상세 정보 조회 중 오류 발생:', error);
    throw error;
  }
};

export const fetchAllRecruitments = async (): Promise<CardData[]> => {
  try {
    const response = await axiosInstance.get('/api/recruitments/');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = response.data;
    
    if (Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      return data.map((item: any) => ({
        id: item.id,
        image: item.images && item.images.length > 0 && item.images[0].image_url 
          ? item.images[0].image_url 
          : "https://via.placeholder.com/300x200",
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data.recruitments && Array.isArray(data.recruitments)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      return data.recruitments.map((item: any) => ({
        id: item.id,
        image: item.images && item.images.length > 0 && item.images[0].image_url 
        ? item.images[0].image_url 
        : "https://via.placeholder.com/300x200", 
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
      params.append('region', searchParams.locations.join(','));
    }
    
    if (searchParams.dateRange) {
      params.append('start_date', searchParams.dateRange.startDate.format('YYYY-MM-DD'));
      params.append('end_date', searchParams.dateRange.endDate.format('YYYY-MM-DD'));
    }
    
    if (searchParams.timeRange) {
      params.append('start_time', searchParams.timeRange.startTime);
      params.append('end_time', searchParams.timeRange.endTime);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get(`/api/recruitments/search/${queryString}`);
    
    console.log('검색 API 응답:', response.data);
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.data && response.data.recruitments && Array.isArray(response.data.recruitments)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('중첩 구조 발견:', response.data.recruitments.length);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      return response.data.recruitments.map((item: any) => ({
        id: item.id,
        image: item.images && item.images.length > 0 && item.images[0].image_url 
          ? item.images[0].image_url 
          : "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    } else if (Array.isArray(response.data)) {
      console.log('일반 배열 구조 발견:', response.data.length);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data.map((item: any) => ({
        id: item.id,
        image: item.images && item.images.length > 0 && item.images[0].image_url 
        ? item.images[0].image_url 
        : "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.data && typeof response.data === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      console.log('다른 구조 발견, 키:', Object.keys(response.data));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (const key in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (Array.isArray(response.data[key])) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log(`${key} 배열 발견:`, response.data[key].length);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          return response.data[key].map((item: any) => ({
            id: item.id,
            image: item.images && item.images.length > 0 && item.images[0].image_url 
          ? item.images[0].image_url 
          : "https://via.placeholder.com/300x200", 
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRecruitment = async (data: CreateRecruitmentParams, images?: File[]): Promise<any> => {
  try {
    const formData = new FormData();
    
    formData.append('shelter', data.shelter.id.toString());
    formData.append('date', data.recruitment.date);
    formData.append('start_time', data.recruitment.start_time);
    formData.append('end_time', data.recruitment.end_time);
    if (data.activities && data.activities.length > 0) {
      formData.append('type', JSON.stringify(data.activities));
    } else if (data.type) {
      const typeCode = convertTypeToCode(data.type);
      formData.append('type', typeCode);
    } else {
      formData.append('type', '[]');
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyForVolunteer = async (
  recruitmentId: string | undefined, 
  selectedTime: string,
  userId: string | undefined
): Promise<any> => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data.map((item: any) => ({
        id: item.id,
        image: item.images && item.images.length > 0 && item.images[0].image_url 
          ? item.images[0].image_url 
          : "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사 센터",
        region: item.shelter_region || "지역 정보 없음",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
        shelter: item.shelter 
      }));
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.data.recruitments && Array.isArray(response.data.recruitments)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      return response.data.recruitments.map((item: any) => ({
        id: item.id,
        image: item.images && item.images.length > 0 && item.images[0].image_url 
        ? item.images[0].image_url 
        : "https://via.placeholder.com/300x200", 
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