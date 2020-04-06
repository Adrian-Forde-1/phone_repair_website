import React from 'react';
import ReactDOM from 'react-dom';
import IndividualRequest from './IndividualRequest';

const renderIndividualRequest = (request) => {
  const infoSection = document.querySelector('.admin-info-section');
  ReactDOM.render(<IndividualRequest request={request} />, infoSection);
};

const RequestPreview = (props) => {
  // const requestStatus = {
  //   PENDING: 'Pending Acceptance',
  //   AWAITING_DEVICE: 'Awaiting device',
  //   BEING_REPAIRED: 'Being repaired',
  //   COMPLETED: 'Completed',
  // };

  // useEffect(() => {
  //   if (props.request.status === requestStatus.PENDING) {
  //     const span = document.querySelector('.status-span');
  //     span.style.backgroundColor = 'white';
  //   }

  //   if (props.request.status === requestStatus.AWAITING_DEVICE) {
  //     const span = document.querySelector('.status-span');
  //     span.style.backgroundColor = 'orange';
  //   }

  //   if (props.request.status === requestStatus.BEING_REPAIRED) {
  //     const span = document.querySelector('.status-span');
  //     span.style.backgroundColor = 'yellow';
  //   }

  //   if (props.request.status === requestStatus.PENDING) {
  //     const span = document.querySelector('.status-span');
  //     span.style.backgroundColor = 'green';
  //   }
  // }, []);
  return (
    <div
      className="request-preview"
      onClick={() => {
        renderIndividualRequest(props.request);
      }}
    >
      <h3>{props.request.usersname}</h3>
      <div className="request-info">
        <p>Device: {props.request.device}</p>
        <div className="request-repair-types">
          {props.request.typeOfRepairs.map(
            (type, index) =>
              index === 0 && <div key={type._id}>Repairs: {type.name}</div>
          )}
          {props.request.typeOfRepairs.length > 1 && <div>...</div>}
          {/* {props.request.typeOfRepairs.map((type, index) => {
            console.log(type);
          })}
          {props.request.typesOfRepair[1] && <div>...</div>} */}
        </div>
        <div className="request-status">
          <p>{props.request.status}</p> <span className="status-span"></span>
        </div>
      </div>
    </div>
  );
};

export default RequestPreview;
