export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }

  export interface UserData {
    id: number;
    email: string;
    nickname?: string;
    profile_image?: string;
    created_at: string;
  }

export interface User {
    email: string;
    password: string;
    password_confirm: string;
    name: string;
    phone_number: string;
}

export interface Shelter {
    name: string;
    shelter_type: string; 
    business_registration_number: string;
    business_registration_email: string;
    address: string;
    owner_name: string;
    contact_number: string;
}

  export interface ShelterSignupRequest {
    user: User;
    shelter: Shelter;
  }
  
  export interface ShelterUserData {
    id: number;
    email: string;
    name: string;
    phone_number: string;
    user_type: string; 
    created_at: string;
  }
  
  export interface ShelterData {
    id: number;
    name: string;
    shelter_type: string;
    business_registration_number: string;
    business_registration_email: string;
    address: string;
    owner_name: string;
    contact_number: string;
    created_at: string;
  }
  
  export type ShelterSignupResponse = ApiResponse<{
    user: ShelterUserData;
    shelter: ShelterData;
}>;

  //일반로그인
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    code: number;
    access_token: string;
    token_type: string;
    message?: string; 
  }

  //카카오 로그인
  export interface KakaoLoginRequest {
    provider_id: string;
  }
  
  export interface KakaoLoginResponse {
    code: number;
    access_token: string;
    token_type: string;
    message?: string; 
  }

  //아이디 찾기
  export interface FindEmailRequest {
    name:string;
    phone_number:string;
  }

  export interface FindEmailResponse {
    code: number;
    email: string;
    message?: string;
  }

  //비밀번호 재설정
  export interface ResetPasswordRequest {
    email: string;
    phone_number: string;
  }
  
  export interface ResetPasswordResponse {
    code: number;
    message: string;
  }

  export interface GetUserInfoResponse {
    code: number;
    user_id: number;
    email: string;
    name: string;
    phone_number: string;
    profile_image: string;
    message?: string; 
  }

  export interface UpdateUserInfoRequest {
    profile_image?: string | File;
  }

  export interface UpdateUserInfoResponse {
    code: number;
    message: string;
  }

  export interface LogOutResponse {
    code:number;
    message?: string;
  }