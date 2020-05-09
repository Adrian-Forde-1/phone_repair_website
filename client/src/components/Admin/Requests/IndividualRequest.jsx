import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

//Componenets
import AllRequest from './AllRequest';

//Redux
import store from '../../../redux/store';

//Actions
import { SET_ERRORS } from '../../../redux/actions/types';

import { getAllRequest } from '../../../redux/actions/requestActions';

function IndividualRequest(props) {
  const requestStatus = {
    PENDING: 'Pending Acceptance',
    AWAITING_DEVICE: 'Awaiting device',
    BEING_REPAIRED: 'Being repaired',
    COMPLETED: 'Completed',
  };

  useEffect(() => {
    const sumOfCost = () => {
      var cost = 0;
      props.request.typeOfRepairs.forEach((repair) => {
        cost = cost + repair.cost;
      });

      return `$${cost} USD`;
    };
    document.querySelector('.request-cost h4').innerHTML = sumOfCost();
  }, []);

  const acceptRequest = (requestId, props) => {
    console.log('Request Accepted');
    console.log(requestId);
    axios
      .post(
        `/api/request/${requestId}/status`,
        { status: requestStatus.AWAITING_DEVICE },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        store
          .dispatch(getAllRequest(localStorage.getItem('token')))
          .then((response) => {
            const currentRequests = response.data;
            const infoSection = document.querySelector('.admin-info-section');
            ReactDOM.render(
              <AllRequest requests={currentRequests} />,
              infoSection
            );
          });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
      });
  };

  const changeRequestToBeingRepaired = (requestId, props) => {
    axios
      .post(
        `/api/request/${requestId}/status`,
        { status: requestStatus.BEING_REPAIRED },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        store
          .dispatch(getAllRequest(localStorage.getItem('token')))
          .then((response) => {
            const currentRequests = response.data;
            const infoSection = document.querySelector('.admin-info-section');
            ReactDOM.render(
              <AllRequest requests={currentRequests} />,
              infoSection
            );
          });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
      });
  };
  const changeRequestToCompleted = (requestId, props) => {
    axios
      .post(
        `/api/request/${requestId}/status`,
        { status: requestStatus.COMPLETED },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then(() => {
        store
          .dispatch(getAllRequest(localStorage.getItem('token')))
          .then((response) => {
            const currentRequests = response.data;
            const infoSection = document.querySelector('.admin-info-section');
            ReactDOM.render(
              <AllRequest requests={currentRequests} />,
              infoSection
            );
          });
      })
      .catch((error) => {
        store.dispatch({ type: SET_ERRORS, payload: error });
      });
  };
  return (
    <div className="individual-request">
      <h1>{props.request.usersname}</h1>

      <div className="individual-request-info-section">
        <p>
          <span className="info-title">User Id:</span>{' '}
          {props.request.createdBy._id}
        </p>
        <p>
          <span className="info-title">Request Id:</span> {props.request._id}
        </p>
        <p>
          <span className="info-title">Device:</span> {props.request.device}
        </p>
        <div className="individual-request-repair-types">
          <span className="info-title">Types Of Repairs:</span>

          {props.request.typeOfRepairs.map((type) => (
            <p key={type._id}>&mdash; {type.name}</p>
          ))}
        </div>
        <p>
          <span className="info-title">Description: </span>
          {props.request.description}
        </p>
        <p>
          <span className="info-title">Created On: </span>
          {props.request.createdAt !== undefined &&
            props.request.createdAt.slice(0, 10)}
        </p>
        <p>
          <span className="info-title">Status:</span> {props.request.status}
        </p>
        <div className="request-cost">
          <h4></h4>
        </div>
        {props.request.status === requestStatus.PENDING && (
          <button
            className="accept-request"
            onClick={() => {
              acceptRequest(props.request._id, props);
            }}
          >
            Accept
          </button>
        )}
        {props.request.status === requestStatus.AWAITING_DEVICE && (
          <button
            className="accept-request"
            onClick={() => {
              changeRequestToBeingRepaired(props.request._id, props);
            }}
          >
            Awaiting Device
          </button>
        )}
        {props.request.status === requestStatus.BEING_REPAIRED && (
          <button
            className="accept-request"
            onClick={() => {
              changeRequestToCompleted(props.request._id, props);
            }}
          >
            Being Repaired
          </button>
        )}
        {props.request.status === requestStatus.COMPLETED && (
          <button className="accept-request" disabled>
            Completed
          </button>
        )}
      </div>
    </div>
  );
}

export default IndividualRequest;
