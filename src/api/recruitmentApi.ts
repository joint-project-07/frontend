import { axiosInstance } from "../api/axios/axiosInstance";

export interface SearchParams {
  locations?: string[];
  dateRange?: {
    startDate: any; 
    endDate: any;   
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
}

export const fetchAllRecruitments = async (): Promise<CardData[]> => {
  try {
    const response = await axiosInstance.get('/api/recruitments/');
    
    console.log('API 응답 구조:', response);
    console.log('response.data 타입:', typeof response.data);
    console.log('Content-Type:', response.headers['content-type']);
    
    if (typeof response.data === 'string' && response.data.includes('<!doctype')) {
      console.error('HTML이 반환되었습니다. API 엔드포인트를 확인해주세요.');
      return [];
    }
    
    if (response && response.data) {
      let data = response.data;
      
      let recruitmentData: ApiRecruitment[] = [];
      
      if (Array.isArray(data)) {
        console.log('데이터가 배열입니다');
        recruitmentData = data;
      } 
      else if (data.results && Array.isArray(data.results)) {
        console.log('데이터가 results 배열을 포함합니다');
        recruitmentData = data.results;
      } 
      else if (typeof data === 'object' && data !== null) {
        console.log('데이터가 객체입니다. 구조:', data);
        
        if ('id' in data) {
          recruitmentData = [data as ApiRecruitment];
        }
      }
      
      return recruitmentData.map(item => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200", 
        title: item.shelter_name || "봉사센터",
        region: "지역 정보", // 실제 region 정보가 없어 보임
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
      }));
    }
    
    console.error('API 응답 데이터가 없음:', response);
    return [];
  } catch (error) {
    console.error('Error fetching all recruitments:', error);
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
    
    const queryParams = params.toString() ? `?${params.toString()}` : '';
    const response = await axiosInstance.get(`/api/recruitments/search${queryParams}`);
    
    console.log('검색 API 응답 구조:', response);
    console.log('response.data 타입:', typeof response.data);
    console.log('Content-Type:', response.headers['content-type']);
    
    if (typeof response.data === 'string' && response.data.includes('<!doctype')) {
      console.error('HTML이 반환되었습니다. API 엔드포인트를 확인해주세요.');
      return [];
    }
    
    if (response && response.data) {
      let data = response.data;
      
      let recruitmentData: ApiRecruitment[] = [];
      
      if (Array.isArray(data)) {
        console.log('검색 데이터가 배열입니다');
        recruitmentData = data;
      } 
      else if (data.results && Array.isArray(data.results)) {
        console.log('검색 데이터가 results 배열을 포함합니다');
        recruitmentData = data.results;
      } 
      else if (typeof data === 'object' && data !== null) {
        console.log('검색 데이터가 객체입니다. 구조:', data);
        
        if ('id' in data) {
          recruitmentData = [data as ApiRecruitment];
        }
      }
      
      return recruitmentData.map(item => ({
        id: item.id,
        image: "https://via.placeholder.com/300x200",
        title: item.shelter_name || "봉사센터",
        region: "지역 정보",
        date: item.date || "날짜 정보 없음",
        volunteerwork: item.type || "봉사 정보 없음",
      }));
    }
    
    console.error('API 응답 데이터가 없음:', response);
    return [];
  } catch (error) {
    console.error('Error searching recruitments:', error);
    return [];
  }
};