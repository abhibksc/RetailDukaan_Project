import React, { useState } from "react";

const ExecutiveSearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query); // Trigger the search callback
    }
  };

  return (
    <div className="">
      <input
        type="text"
        placeholder="Search by .."
        className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-1/2 focus:outline-none "
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};

export default ExecutiveSearchBar;
