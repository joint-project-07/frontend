import React from 'react';
import { redirectToKakaoLogin } from '../../service/kakaoAuth';

interface KakaoLoginButtonProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className = '',
  size = 'medium',
  disabled = false,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      redirectToKakaoLogin();
    }
  };

  return (
    <button
      type="button"
      className={`kakao-login-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <img 
        src="/assets/kakao_login_medium_wide.png" 
        alt="카카오 계정으로 로그인" 
        style={{
          display: 'block',
          width: size === 'small' ? '150px' : size === 'large' ? '300px' : '222px',
          height: 'auto'
        }}
      />
    </button>
  );
};

export default KakaoLoginButton;