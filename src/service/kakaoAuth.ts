const KAKAO_CLIENT_ID = import.meta.env.KAKAO_REST_API_KEY 
const KAKAO_REDIRECT_URI = import.meta.env.KAKAO_REDIRECT_URI 

export const redirectToKakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoAuthUrl;
};
