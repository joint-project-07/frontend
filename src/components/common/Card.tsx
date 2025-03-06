import React from "react";
import "../../style/Card.css";
import dangimg from "../../assets/dangimg.png";

interface CardProps {
  image: string;
  title: string;
  region: string;
  date: string;
  volunteerwork: string;
}
const Card: React.FC<CardProps> = ({
  image,
  title,
  region,
  date,
  volunteerwork,
}) => {
  return (
    <div className="card">
      <img src={dangimg} alt={title} />
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
