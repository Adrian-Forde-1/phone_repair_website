import React from 'react';

function SearchBar(props) {
  return (
    <div className="search-bar no-select">
      <input
        type="text"
        name="search"
        placeholder="Search by user's name"
        onChange={props.onChange}
      />
    </div>
  );
}

export default SearchBar;
