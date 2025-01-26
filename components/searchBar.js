import React from "react";
import "./searchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
          
      </div>
    </div>
  );
};

export default SearchBar;