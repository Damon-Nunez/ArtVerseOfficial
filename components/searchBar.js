import React from "react";
import "./searchBar.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
       <input
  type="text"
  placeholder="Search posts..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      onSearch(input);
    }
  }}
/>


          
      </div>
    </div>
  );
};

export default SearchBar;