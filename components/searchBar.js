import React from "react";
import "./searchBar.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react";

const SearchBar = ({ input, setInput, onSearch }) => {



  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
       <input
  type="text"
  className="search-input"
  placeholder="Search posts..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
onKeyDown={(e) => {
 if (e.key === 'Enter') {
    onSearch(input); // Now always calls handleSearch
  }
  console.log("Search triggered:", input);
}}

/>


          
      </div>
    </div>
  );
};

export default SearchBar;