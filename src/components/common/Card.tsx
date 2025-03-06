import React from "react";
import "../../style/Card.css";
import dangimg from "../../assets/dangimg.png";

interface CardProps {
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
  onClick?: () => void; // Make sure to include onClick in the props
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  region,
  date,
  volunteerwork,
  onClick, // Destructure onClick
}) => {
  return (
    <div className="card" onClick={onClick}>
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
