import { axiosInstance } from "../api/axios/axiosInstance";
import axios from "axios";

const KAKAO_CLIENT_ID = import.meta.env.KAKAO_REST_API_KEY 
const KAKAO_REDIRECT_URI = import.meta.env.KAKAO_REDIRECT_URI 

export const redirectToKakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoAuthUrl;
};

export const getKakaoToken = async (code: string) => {
  try {
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_CLIENT_ID,
          redirect_uri: KAKAO_REDIRECT_URI,
          code: code
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('카카오 토큰 요청 오류:', error);
    throw error;
  }
};

export const kakaoLogin = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post('/api/users/kakao-login/', { 
      access_token: accessToken 
    });
    return response.data;
  } catch (error) {
    console.error('카카오 로그인 처리 오류:', error);
    throw error;
  }
};