import axios from 'axios';
import { KAKAO_AUTH } from '../../utils/constants';
import { KakaoTokenResponse, KakaoUserInfo, User } from '../../types/auth';
import axiosInstance from '../api/axiosInstance';

interface BackendResponse {
  token: string;
  user: {
    id: string;
  };
}

export const redirectToKakaoLogin = (): void => {
  const kakaoAuthUrl = new URL(KAKAO_AUTH.AUTH_URL);
  
  kakaoAuthUrl.searchParams.append("client_id", KAKAO_AUTH.REST_API_KEY);
  kakaoAuthUrl.searchParams.append("redirect_uri", KAKAO_AUTH.REDIRECT_URI);
  kakaoAuthUrl.searchParams.append("response_type", "code");
  kakaoAuthUrl.searchParams.append("scope", "profile_nickname profile_image account_email");
  window.location.href = kakaoAuthUrl.toString();
};

export const getKakaoToken = async (code: string): Promise<KakaoTokenResponse> => {
  try {
    const response = await axios.post<KakaoTokenResponse>(
      KAKAO_AUTH.TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_AUTH.REST_API_KEY,
        redirect_uri: KAKAO_AUTH.REDIRECT_URI,
        code: code
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );
    
    return response.data;
    
  } catch (error) {
    console.error('카카오 토큰 요청 중 오류 발생:', error);
    throw error;
  }
};

export const getKakaoUserInfo = async (accessToken: string): Promise<KakaoUserInfo> => {
  try {
    const response = await axios.get<KakaoUserInfo>(
      KAKAO_AUTH.USER_INFO_URL,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );
    
    return response.data;
    
  } catch (error) {
    console.error('카카오 사용자 정보 요청 중 오류 발생:', error);
    throw error;
  }
};

export const formatKakaoUser = (kakaoUser: KakaoUserInfo, accessToken: string, refreshToken?: string): User => {
  return {
    id: String(kakaoUser.id),
    name: kakaoUser.properties.nickname || '사용자',
    email: kakaoUser.kakao_account.email,
    profileImage: kakaoUser.properties.profile_image,
    provider: 'kakao',
    accessToken,
    refreshToken
  };
};

export const registerKakaoUserToBackend = async (kakaoUser: User): Promise<BackendResponse> => {
  try {
    const response = await axiosInstance.post('/auth/kakao/login', {
      kakaoId: kakaoUser.id,
      email: kakaoUser.email,
      name: kakaoUser.name,
      profileImage: kakaoUser.profileImage,
      kakaoAccessToken: kakaoUser.accessToken
    });
    
    return response.data;
    
  } catch (error) {
    console.error('백엔드 사용자 등록/로그인 중 오류:', error);
    throw error;
  }
};

export const processKakaoLogin = async (code: string): Promise<User> => {
  const tokenData = await getKakaoToken(code);
  const userInfo = await getKakaoUserInfo(tokenData.access_token);
  
  const kakaoUser = formatKakaoUser(
    userInfo, 
    tokenData.access_token, 
    tokenData.refresh_token
  );
  
  // const backendResponse = await registerKakaoUserToBackend(kakaoUser);
  
  return kakaoUser;
};