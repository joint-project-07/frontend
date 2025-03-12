import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth/authStore';

const KakaoCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { processKakaoAuth, setLoading, setError, isLoading, error, resetError } = useAuthStore();

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
        await processKakaoAuth(code);
        navigate('/');
      } catch (err) {
        console.error('카카오 로그인 처리 중 오류:', err);
      }
    };

    handleKakaoCallback();
  }, [location, navigate, processKakaoAuth, setLoading, setError]);

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
        <button 
          onClick={() => {
            resetError();
            navigate('/');
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return null;
};

export default KakaoCallbackPage;