import React from 'react';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

function AdminSideBar() {
  return (
    <div>
      <div
        className="side-nav-opener"
        onClick={() => {
          document.querySelector('.side-nav').classList.toggle('open');
          document.querySelector('.side-nav-opener').classList.toggle('open');
        }}
      >
        <i className="fas fa-long-arrow-alt-right"></i>
      </div>
      <nav className="side-nav">
        <ul>
          <li>
            <Link to="/">
              <i className="fas fa-home"></i>
            </Link>
          </li>
          <hr />
          <li>
            <Link to="/admin/users" id="render-users-btn">
              <i className="fas fa-users"></i>
              <p>Users</p>
            </Link>
          </li>
          <li>
            <Link to="/admin/requests" id="render-requests-btn">
              <i className="fas fa-copy"></i>
              <p>Requests</p>
            </Link>
          </li>
          <li>
            <Link to="/admin/devices" id="render-devices-btn">
              <i className="fas fa-mobile"></i>
              <p>Devices</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default withRouter(AdminSideBar);
