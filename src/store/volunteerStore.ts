import { create } from 'zustand';
import { 
  getVolunteerApplications, 
  submitVolunteerRating, 
  VolunteerApplication 
} from '../api/VolunteerApi';

interface VolunteerStore {
  applications: VolunteerApplication[];
  isLoading: boolean;
  error: string | null;
  
  isSubmittingRating: boolean;
  ratingError: string | null;
  
  fetchApplications: () => Promise<void>;
  submitRating: (historyId: number, rating: number) => Promise<boolean>;
  
  getPendingApplications: () => VolunteerApplication[];
  getApprovedApplications: () => VolunteerApplication[];
  getRejectedApplications: () => VolunteerApplication[];
}

export const useVolunteerStore = create<VolunteerStore>((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,
  
  isSubmittingRating: false,
  ratingError: null,
  
  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const applications = await getVolunteerApplications();
      set({ applications, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '봉사 신청 목록을 불러오는데 실패했습니다.'
      });
    }
  },
  
  submitRating: async (historyId: number, rating: number) => {
    set({ isSubmittingRating: true, ratingError: null });
    try {
      const response = await submitVolunteerRating(historyId, rating);
      
      set((state) => ({
        applications: state.applications.map(app => 
          app.id === historyId ? { ...app, rating: response.rating } : app
        ),
        isSubmittingRating: false
      }));
      
      return true;
    } catch (error) {
      set({ 
        isSubmittingRating: false, 
        ratingError: error instanceof Error ? error.message : '평가 제출에 실패했습니다.'
      });
      return false;
    }
  },
  
  getPendingApplications: () => {
    return get().applications.filter(app => app.status === 'pending');
  },
  
  getApprovedApplications: () => {
    return get().applications.filter(app => app.status === 'approved');
  },
  
  getRejectedApplications: () => {
    return get().applications.filter(app => app.status === 'rejected');
  }
}));