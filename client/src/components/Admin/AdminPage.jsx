import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AllRequest from './AllRequest';
import AllUsers from './AllUsers';
import PropTypes from 'prop-types';

//redux
import { connect, Provider } from 'react-redux';
import store from '../../redux/store';

//Actions
import { getAllRequest } from '../../redux/actions/requestActions';
import { getAllUsers } from '../../redux/actions/userActions';
import { getAllDevices } from '../../redux/actions/deviceActions';

//react router dom
import { Link } from 'react-router-dom';
import AllDevices from './AllDevices';
import Page404 from '../404';

class AdminPage extends Component {
  componentDidMount() {
    this.props.getAllUsers(localStorage.getItem('token'));
    this.props.getAllRequest(localStorage.getItem('token'));
    this.props.getAllDevices(localStorage.getItem('token'));
    // const infoSection = document.querySelector('.admin-info-section');

    const infoSection = document.querySelector('.admin-info-section');
    ReactDOM.render(<AllRequest requests={this.props.requests} />, infoSection);
  }

  render() {
    const renderUsers = () => {
      const infoSection = document.querySelector('.admin-info-section');
      ReactDOM.render(<AllUsers users={this.props.users} />, infoSection);
    };

    const renderRequests = () => {
      const infoSection = document.querySelector('.admin-info-section');
      ReactDOM.render(
        <AllRequest requests={this.props.requests} />,
        infoSection
      );
    };

    const renderDevices = () => {
      const infoSection = document.querySelector('.admin-info-section');
      ReactDOM.render(
        <AllDevices
          devices={this.props.devices}
          user={this.props.user}
          messages={this.props.messages}
        />,
        infoSection
      );
    };

    if (this.props.user !== undefined) {
      if (
        this.props.user.role === 'Owner' ||
        this.props.user.role === 'Admin'
      ) {
        return (
          <div className="admin-page">
            <div
              className="side-nav-opener"
              onClick={() => {
                document.querySelector('.side-nav').classList.toggle('open');
                document
                  .querySelector('.side-nav-opener')
                  .classList.toggle('open');
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
                {/* <li>
                  <button>
                    <i className="fas fa-chart-line"></i>
                    <p>Dashboard</p>
                  </button>
                </li> */}
                <li>
                  <button onClick={renderUsers}>
                    <i className="fas fa-users"></i>
                    <p>Users</p>
                  </button>
                </li>
                <li>
                  <button onClick={renderRequests}>
                    <i className="fas fa-copy"></i>
                    <p>Requests</p>
                  </button>
                </li>
                <li>
                  <button onClick={renderDevices}>
                    <i className="fas fa-mobile"></i>
                    <p>Devices</p>
                  </button>
                </li>
              </ul>
            </nav>
            <Provider store={store}>
              <div className="admin-info-section"></div>
            </Provider>
          </div>
        );
      } else {
        return <Page404 />;
      }
    } else {
      return <Page404 />;
    }
  }
}

const mapDispatchToProps = {
  getAllUsers,
  getAllRequest,
  getAllDevices,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  users: state.api.users,
  requests: state.api.requests,
  devices: state.api.devices,
  messages: state.UI.messages,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
