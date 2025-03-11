import React from "react";
import dogImage from "../../src/assets/dog-image.png";
import "../style/SearchNotFound.css";
import SearchBar from "../components/feature/SearchBar";

interface SearchNotFoundProps {
  message?: string;
}

const SearchNotFound: React.FC<SearchNotFoundProps> = ({
  message = "검색결과에 해당하는 보호소가 없어요",
}) => {
  return (
    <>
      <SearchBar />
      <div className="search-not-found">
        <h2>앗!</h2>
        <p>{message}</p>
        <img src={dogImage} alt="검색 결과 없음" className="not-found-image" />
      </div>
    </>
  );
};

export default SearchNotFound;
