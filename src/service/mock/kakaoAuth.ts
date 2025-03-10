import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { KakaoTokenResponse, KakaoUserInfo, User } from '../../types/auth';
import { KAKAO_AUTH } from '../../utils/constants';

const mockAxios = new MockAdapter(axios, { delayResponse: 1000 });

const mockTokenResponse: KakaoTokenResponse = {
  access_token: "mock_access_token_kakao_12345",
  token_type: "bearer",
  refresh_token: "mock_refresh_token_kakao_67890",
  expires_in: 21599,
  scope: "profile_nickname profile_image account_email",
  refresh_token_expires_in: 5183999
};

const mockUserInfo: KakaoUserInfo = {
  id: 123456789,
  connected_at: "2023-01-01T12:00:00Z",
  properties: {
    nickname: "사용자닉네임",
    profile_image: "https://via.placeholder.com/150",
    thumbnail_image: "https://via.placeholder.com/50"
  },
  kakao_account: {
    profile_nickname_needs_agreement: false,
    profile_image_needs_agreement: false,
    profile: {
      nickname: "사용자닉네임",
      thumbnail_image_url: "https://via.placeholder.com/50",
      profile_image_url: "https://via.placeholder.com/150"
    },
    has_email: true,
    email_needs_agreement: false,
    is_email_valid: true,
    is_email_verified: true,
    email: "user@example.com"
  }
};

export const setupKakaoMockAPI = () => {
  mockAxios.onPost(KAKAO_AUTH.TOKEN_URL).reply(200, mockTokenResponse);
  mockAxios.onGet(KAKAO_AUTH.USER_INFO_URL).reply((config) => {
    const authHeader = config.headers?.['Authorization'];
    if (authHeader === `Bearer ${mockTokenResponse.access_token}`) {
      return [200, mockUserInfo];
    }
    return [401, { error: 'invalid_token' }];
  });
  
  console.log('카카오 목업 API 설정 완료');
};

export const mockGetKakaoToken = async (code: string): Promise<KakaoTokenResponse> => {
  try {
    console.log(`Mock: 인증 코드 ${code}로 토큰 요청`);
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
    
    console.log('Mock: 토큰 요청 성공');
    return response.data;
    
  } catch (error) {
    console.error('Mock: 토큰 요청 실패', error);
    throw error;
  }
};

export const mockGetKakaoUserInfo = async (accessToken: string): Promise<KakaoUserInfo> => {
  try {
    console.log(`Mock: 액세스 토큰으로 사용자 정보 요청`);
        const response = await axios.get<KakaoUserInfo>(
      KAKAO_AUTH.USER_INFO_URL,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );
    
    console.log('Mock: 사용자 정보 요청 성공');
    return response.data;
    
  } catch (error) {
    console.error('Mock: 사용자 정보 요청 실패', error);
    throw error;
  }
};

export const mockFormatKakaoUser = (kakaoUser: KakaoUserInfo, accessToken: string, refreshToken?: string): User => {
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

export const mockProcessKakaoLogin = async (code: string): Promise<User> => {
  try {
    console.log(`Mock: 카카오 로그인 프로세스 시작 (코드: ${code})`);
    
    setupKakaoMockAPI();
    const tokenData = await mockGetKakaoToken(code);
    const userInfo = await mockGetKakaoUserInfo(tokenData.access_token);
    const user = mockFormatKakaoUser(
      userInfo,
      tokenData.access_token,
      tokenData.refresh_token
    );
    
    console.log(`Mock: 카카오 로그인 프로세스 완료`, user);
    return user;
    
  } catch (error) {
    console.error(`Mock: 카카오 로그인 프로세스 실패`, error);
    throw error;
  }
};

export const mockGenerateKakaoCode = (): string => {
  return `mock_kakao_auth_code_${Math.random().toString(36).substring(2, 15)}`;
};