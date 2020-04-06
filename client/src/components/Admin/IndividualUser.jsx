import React from 'react';

function IndividualUser(props) {
  const { user } = props;
  return (
    <div className="individual-user">
      <h1>
        {user.fname} {user.lname}
      </h1>
      <p>
        <span className="info-title">User Id:</span> {user._id}
      </p>
      <p>
        <span className="info-title">Email:</span> {user.email}
      </p>
      {user.role === 'Customer' &&
        (user.numberOfRequestCreated >= 0 ? (
          <p>
            <span className="info-title">Number of Request Created: </span>
            {user.numberOfRequestCreated}
          </p>
        ) : (
          <div></div>
        ))}
      {user.role === 'Customer' &&
        (user.numberOfCurrentRequest >= 0 ? (
          <p>
            <span className="info-title">Number of Current Request: </span>
            {user.numberOfCurrentRequest}
          </p>
        ) : (
          <div></div>
        ))}
      <p>
        <span className="info-title">Role: </span>
        {user.role}
      </p>
      <p>
        <span className="info-title">Created At: </span>
        {user.createdAt.slice(0, 10)}
      </p>
    </div>
  );
}

export default IndividualUser;
