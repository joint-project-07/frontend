import React from "react";
import styles from "../../style/StarRating.module.scss";
import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? styles.activeStar : styles.star}
          onClick={() => setRating(star)}
        >
          {star <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
