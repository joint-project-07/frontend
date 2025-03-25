import React from "react";
import styles from "../../style/Card.module.scss";
import dangimg from "../../assets/dangimg.png";

interface CardProps {
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  region,
  date,
  volunteerwork,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={dangimg} alt={image} />
      <div>
        <h3>{title}</h3>
        <p>{region}</p>
        <p>{date}</p>
        <p>{volunteerwork}</p>
      </div>
    </div>
  );
};

export default Card;