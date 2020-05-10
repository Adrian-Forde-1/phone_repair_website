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
        <h1>{user.fullname}</h1>
        <div className="info-title">
          <p>
            <span>ID:</span> {user._id}
          </p>
        </div>
        <div className="info-title">
          <p>
            <span>Create At:</span> {user.createdAt.slice(0, 10)}
          </p>
        </div>

        <div className="individual-user-information ">
          <div>
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          <div>
            <h3>Role</h3>
            <p>{user.role}</p>
          </div>
          {user.role === 'Customer' && (
            <div>
              <h3>No. of Request Created</h3>
              <p className="individual-user-big-text">
                {user.numberOfRequestCreated}
              </p>
            </div>
          )}
          {user.role === 'Customer' && (
            <div>
              <h3>No. of Current Requests</h3>
              <p className="individual-user-big-text">
                {user.numberOfCurrentRequest}
              </p>
            </div>
          )}
        </div>
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
