import React from 'react';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

function UserPreview(props) {
  return (
    <div className="user-preview">
      <Link to={`/admin/user/${props.user._id}`}>
        <p>
          {props.user.fname} {props.user.lname}
        </p>
        <p>{props.user.email}</p>
        <p>{props.user.role}</p>
      </Link>
    </div>
  );
}

export default withRouter(UserPreview);
