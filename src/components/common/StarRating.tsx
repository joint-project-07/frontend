import React from "react";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating  ? "star active" : "star"}
          onClick={() => setRating(star)}
        >
          {star <= rating ? "⭐" : "★"}
        </span>
      ))}
    </div>
  );
};

export default StarRating;