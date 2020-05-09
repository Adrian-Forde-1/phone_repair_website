import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Actions
import {
  setErrors,
  setLoadingUI,
  stopLoadingUI,
} from '../../../redux/actions/userActions';

//Components
import AdminSideBar from '../AdminSideBar';

function IndividualUser(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = props.match.params.userId;
    props.setLoadingUI();
    axios
      .get(`/api/user/${userId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        setUser(response.data);
        props.stopLoadingUI();
      })
      .catch((error) => {
        props.stopLoadingUI();
        setErrors(error);
      });
  }, []);
  return (
    Object.keys(user).length > 0 && (
      <div className="individual-user">
        <AdminSideBar />
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
    )
  );
}

const mapDispatchToProps = {
  setErrors,
  setLoadingUI,
  stopLoadingUI,
};

export default connect(null, mapDispatchToProps)(IndividualUser);
