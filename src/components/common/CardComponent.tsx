import React from "react";
import "./CardComponent.css";

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
      <img src={image} alt={title} />
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
