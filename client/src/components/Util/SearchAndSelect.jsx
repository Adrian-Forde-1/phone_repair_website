import React, { useEffect } from 'react';

//React Router DOM
import { withRouter } from 'react-router-dom';

function SearchAndSelect(props) {
  useEffect(() => {
    if (props.history.location.pathname.indexOf('admin') > -1)
      document.querySelector('.search-bar').classList.add('admin-search');
  }, [props.history.location.pathname]);
  return (
    <div className="search-bar">
      <input
        type="search"
        name="search"
        onChange={props.onChange}
        placeholder="Search by client's name"
      />
      <select name="filter" id="filter" onChange={props.onChange}>
        <option value="All">All</option>
        <option value="Pending Acceptance">Pending</option>
        <option value="Awaiting Device">Awaiting Device</option>
        <option value="Being Repaired">Being Repaired</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
}

export default withRouter(SearchAndSelect);
