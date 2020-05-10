import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

//Redux
import { connect } from 'react-redux';

//Actions
import { setErrors } from '../../../redux/actions/userActions';

//Components
import AdminSideBar from '../AdminSideBar';

function IndividualRequest(props) {
  const [request, setRequest] = useState({});

  const requestStatus = {
    PENDING: 'Pending Acceptance',
    AWAITING_DEVICE: 'Awaiting device',
    BEING_REPAIRED: 'Being repaired',
    COMPLETED: 'Completed',
  };

  useEffect(() => {
    const requestId = props.match.params.requestId;
    axios
      .get(`/api/request/${requestId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setRequest(response.data);
      })
      .catch((error) => {
        setErrors(error);
        props.history.goBack();
      });
  }, []);

  useEffect(() => {
    if (Object.keys(request).length > 0) {
      const sumOfCost = () => {
        var cost = 0;
        request.typeOfRepairs.forEach((repair) => {
          cost = cost + repair.cost;
        });

        return `$${cost} USD`;
      };
      document.querySelector('.request-cost h4').innerHTML = sumOfCost();
    }
  }, [request]);

  const acceptRequest = (requestId, props) => {
    axios
      .put(
        `/api/request/${requestId}/status`,
        { status: requestStatus.AWAITING_DEVICE },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        setRequest(response.data);
      })
      .catch((error) => {
        setErrors(error);
      });
  };

  const changeRequestToBeingRepaired = (requestId, props) => {
    axios
      .put(
        `/api/request/${requestId}/status`,
        { status: requestStatus.BEING_REPAIRED },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        setRequest(response.data);
      })
      .catch((error) => {
        setErrors(error);
      });
  };
  const changeRequestToCompleted = (requestId, props) => {
    axios
      .put(
        `/api/request/${requestId}/status`,
        { status: requestStatus.COMPLETED },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        setRequest(response.data);
      })
      .catch((error) => {
        setErrors(error);
      });
  };
  return (
    Object.keys(request).length > 0 && (
      <div className="individual-request">
        <AdminSideBar />
        <h1>{request.usersname}</h1>

        <div className="individual-request-info-section">
          <p>
            <span className="info-title">User Id:</span> {request.createdBy._id}
          </p>
          <p>
            <span className="info-title">Request Id:</span> {request._id}
          </p>
          <p>
            <span className="info-title">Device:</span> {request.device}
          </p>
          <div className="individual-request-repair-types">
            <span className="info-title">Types Of Repairs:</span>

            {request.typeOfRepairs.map((type) => (
              <p key={type._id}>&mdash; {type.name}</p>
            ))}
          </div>
          <p>
            <span className="info-title">Description: </span>
            {request.description}
          </p>
          <p>
            <span className="info-title">Created On: </span>
            {request.createdAt !== undefined && request.createdAt.slice(0, 10)}
          </p>
          <p>
            <span className="info-title">Status:</span> {request.status}
          </p>
          <div className="request-cost">
            <h4></h4>
          </div>
          {request.status === requestStatus.PENDING && (
            <button
              className="accept-request"
              onClick={() => {
                acceptRequest(request._id, props);
              }}
            >
              Accept
            </button>
          )}
          {request.status === requestStatus.AWAITING_DEVICE && (
            <button
              className="accept-request"
              onClick={() => {
                changeRequestToBeingRepaired(request._id, props);
              }}
            >
              Awaiting Device
            </button>
          )}
          {request.status === requestStatus.BEING_REPAIRED && (
            <button
              className="accept-request"
              onClick={() => {
                changeRequestToCompleted(request._id, props);
              }}
            >
              Being Repaired
            </button>
          )}
          {request.status === requestStatus.COMPLETED && (
            <button className="accept-request" disabled>
              Completed
            </button>
          )}
        </div>
      </div>
    )
  );
}

const mapDispatchToProps = {
  setErrors,
};

export default connect(null, mapDispatchToProps)(IndividualRequest);
