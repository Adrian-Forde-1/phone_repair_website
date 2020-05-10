import React, { useEffect } from 'react';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

const RequestPreview = (props) => {
  const requestStatus = {
    PENDING: 'Pending Acceptance',
    AWAITING_DEVICE: 'Awaiting device',
    BEING_REPAIRED: 'Being repaired',
    COMPLETED: 'Completed',
  };

  useEffect(() => {
    if (props.request.status === requestStatus.PENDING) {
      document.querySelector(
        `#status-span-${props.request._id}`
      ).style.backgroundColor = 'white';
    }

    if (props.request.status === requestStatus.AWAITING_DEVICE) {
      document.querySelector(
        `#status-span-${props.request._id}`
      ).style.backgroundColor = 'orange';
    }

    if (props.request.status === requestStatus.BEING_REPAIRED) {
      document.querySelector(
        `#status-span-${props.request._id}`
      ).style.backgroundColor = 'yellow';
    }

    if (props.request.status === requestStatus.COMPLETED) {
      document.querySelector(
        `#status-span-${props.request._id}`
      ).style.backgroundColor = '#00FF00';
    }
  }, []);
  return (
    <div className="request-preview">
      <Link to={`/admin/request/${props.request._id}`}>
        <h3>{props.request.usersname}</h3>
        <div className="request-info">
          <p>Device: {props.request.device}</p>
          <div className="request-preview-repair-types">
            {props.request.typeOfRepairs.map(
              (type, index) =>
                index === 0 && <p key={type._id}>Repairs: {type.name}</p>
            )}
            {props.request.typeOfRepairs.length > 1 && <span>...</span>}
          </div>
          <div className="request-preview-status">
            <p>{props.request.status}</p>{' '}
            <span
              className="status-span"
              id={`status-span-${props.request._id}`}
            ></span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default withRouter(RequestPreview);
