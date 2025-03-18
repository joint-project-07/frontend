import React from 'react';
// import { redirectToKakaoLogin } from '../../service/auth/kakaoAuth';
import { mockGenerateKakaoCode } from '../../auth/kakaoAuthProvider';

interface KakaoLoginButtonProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  className = '',
  size = 'medium',
  text = '카카오 계정으로 로그인',
  disabled = false,
  onClick,
}) => {
  const sizeStyles = {
    small: { padding: '6px 12px', fontSize: '12px' },
    medium: { padding: '10px 20px', fontSize: '14px' },
    large: { padding: '12px 24px', fontSize: '16px' },
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
    //   redirectToKakaoLogin();
     
      const code = mockGenerateKakaoCode();
      window.location.href = `http://localhost:5173/oauth/kakao/callback?code=${code}`;
      
    }
  };

  return (
    <button
      type="button"
      className={`kakao-login-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        backgroundColor: '#FEE500',
        color: '#000000',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.7 : 1,
        ...sizeStyles[size]
      }}
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 18 18" 
        style={{ marginRight: '8px' }}
      >
        <path 
          fill="#000000" 
          d="M9 1.5C5.15905 1.5 2 4.02888 2 7.14795C2 9.22203 3.24486 11.0340 5.10791 12.0717L4.2939 15.0764C4.2473 15.2522 4.45041 15.3914 4.60205 15.2834L8.20345 12.9438C8.46699 12.9699 8.7305 13 9 13C12.8405 13 16 10.4711 16 7.14795C16 4.02888 12.8405 1.5 9 1.5Z"
        />
      </svg>
      {text}
    </button>
  );
};

export default KakaoLoginButton;