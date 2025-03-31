import React, { useEffect } from "react";
import styles from "../../style/Card.module.scss";
import dangimg from "../../assets/dangimg.png"; // 대체 이미지로 유지
import { convertCodeToType } from "../../api/recruitmentApi";

interface CardProps {
  id: number; // ID도 추가해서 어떤 카드인지 구분
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string | string[]; 
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  id,
  image,
  title,
  region,
  date,
  volunteerwork,
  onClick,
}) => {
  useEffect(() => {
    console.log(`Card ${id} - 이미지 URL:`, image);
  }, [id, image]);

  let displayVolunteerWork: string;
  
  if (Array.isArray(volunteerwork)) {
    displayVolunteerWork = volunteerwork
      .map(code => convertCodeToType(code))
      .join(', ');
  } else if (typeof volunteerwork === 'string') {
    displayVolunteerWork = convertCodeToType(volunteerwork);
  } else {
    displayVolunteerWork = String(volunteerwork);
  }

  // 이미지 로딩 실패 시 대체 이미지를 사용하는 함수
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Card ${id} - 이미지 로딩 실패, 대체 이미지 사용:`, image);
    event.currentTarget.src = dangimg;
  };

  return (
    <div className={styles.card} onClick={onClick}>
      {/* image prop으로 전달된 URL을 사용, 로딩 실패 시 dangimg로 대체 */}
      <img 
        src={image} 
        alt={title} 
        onError={handleImageError} 
      />
      <div>
        <h3>{title}</h3>
        <p>{region}</p>
        <p>{date}</p>
        <p>{displayVolunteerWork}</p>
      </div>
    </div>
  );
};

export default Card;