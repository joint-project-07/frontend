import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { processKakaoLogin } from '../service/auth/kakaoAuth';
import { mockProcessKakaoLogin } from '../service/mock/kakaoAuth';
import { useAuthStore } from '../store/authStore';

const KakaoCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login, setLoading, setError, isLoading, error } = useAuthStore();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      setLoading(true);
      
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      
      if (!code) {
        setError('인증 코드를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }
      
      try {
        // 실제 카카오 API 연동
        // const user = await processKakaoLogin(code);
        
        const user = await mockProcessKakaoLogin(code);
        login(user);
        
        console.log('카카오 로그인 성공:', user);
        
        navigate('/');
      } catch (err) {
        console.error('카카오 로그인 처리 중 오류:', err);
        let errorMessage = '로그인 처리 중 오류가 발생했습니다.';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    handleKakaoCallback();
  }, [location, navigate, login, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="kakao-callback-loading">
        <div className="loading-spinner"></div>
        <p>카카오 로그인 처리 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kakao-callback-error">
        <h2>로그인 오류</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  return null;
};

export default KakaoCallbackPage