import React, { useEffect, useState } from 'react';
import axios from 'axios';

function IndividualRequest(props) {
  const deleteRequest = (requestId, history) => {
    axios
      .delete(`/user/request/${requestId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(() => {
        history.push('/requests');
      });
  };

  const [request, editRequest] = useState({});

  useEffect(() => {
    axios
      .get(`/user/request/${props.match.params.requestId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        editRequest(response.data);

        const sumOfCost = () => {
          var cost = 0;
          response.data.typeOfRepairs.forEach((repair) => {
            cost = cost + repair.cost;
          });

          return `$${cost} USD`;
        };
        document.querySelector('.request-cost h4').innerHTML = sumOfCost();
      });
  }, []);
  return (
    <div className="client">
      <div className="individual-request">
        {request !== null && (
          <div>
            <h1>{request.usersname}</h1>

            <div className="individual-request-info-section">
              <p>
                <span className="info-title">User Id:</span> {request.createdBy}
              </p>
              <p>
                <span className="info-title">Request Id:</span> {request._id}
              </p>
              <p>
                <span className="info-title">Device:</span> {request.device}
              </p>
              <div className="individual-request-repair-types">
                <span className="info-title">Types Of Repairs:</span>

                {request.typeOfRepairs !== undefined &&
                  request.typeOfRepairs.map((type) => (
                    <p key={type._id}>&mdash; {type.name}</p>
                  ))}
              </div>
              <p>
                <span className="info-title">Description: </span>
                {request.description}
              </p>
              <p>
                <span className="info-title">Created On: </span>
                {request.createdAt !== undefined &&
                  request.createdAt.slice(0, 10)}
              </p>
              <p>
                <span className="info-title">Status:</span> {request.status}
              </p>
              <div className="request-cost">
                <h4></h4>
              </div>
            </div>
          </div>
        )}

        {request.status === 'Pending Acceptance' && (
          <button
            className="remove-request"
            onClick={() => {
              deleteRequest(request._id, props.history);
            }}
          >
            <i className="fas fa-minus"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default IndividualRequest;
