import React from 'react';
import './styles/styles.css';

//react router dom
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Homepage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';

//Redux

import { connect } from 'react-redux';
import AdminPage from './components/Admin/AdminPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import CreateRequest from './components/Client/CreateRequest';
import AllClientRequest from './components/Client/AllClientRequest';
import ScrollToTop from './components/ScrollToTop';
import AllUsers from './components/Admin/Users/AllUsers';
import AllRequest from './components/Admin/Requests/AllRequest';
import AllDevices from './components/Admin/Devices/AllDevices';
import Dashboard from './components/Admin/Dashboard';
import IndividualUser from './components/Admin/Users/IndividualUser';
import IndividualDevice from './components/Admin/Devices/IndividualDevice';
import IndividualRequest from './components/Client/IndividualRequest';
import IndividualAdminRequest from './components/Admin/Requests/IndividualRequest';

function App(props) {
  const { loading } = props;
  const loadingRoot = document.querySelector('#loading-root');
  const bodyElement = document.querySelector('body');

  useEffect(() => {
    if (loading === true) {
      const element = document.createElement('div');
      element.classList.add('loading-element');
      loadingRoot.appendChild(element);
      bodyElement.style.overflowY = 'hidden';

      ReactDOM.render(<Loading />, element);
    }
    if (loading === false) {
      const element = document.querySelector('.loading-element');
      if (loadingRoot.contains(element)) {
        loadingRoot.removeChild(element);
        bodyElement.style.overflowY = 'visible';
      }
    }
  }, [loading]);
  return (
    <Router>
      <ScrollToTop>
        <Navbar />
        <div className="App">
          {/* <Loading /> */}
          {/* {loading === true && <Loading />} */}
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />

            <Route exact path="/admin/dashboard" component={Dashboard} />
            <Route path="/admin/users" component={AllUsers} />
            <Route path="/admin/requests" component={AllRequest} />
            <Route path="/admin/devices" component={AllDevices} />
            <Route path="/admin/user/:userId" component={IndividualUser} />
            <Route
              path="/admin/request/:requestId"
              component={IndividualAdminRequest}
            />
            <Route
              path="/admin/device/:deviceId"
              component={IndividualDevice}
            />

            <Route exact path="/request" component={CreateRequest} />
            <Route exact path="/requests" component={AllClientRequest} />
            <Route
              exact
              path="/requests/:requestId"
              component={IndividualRequest}
            />
          </Switch>
          <Footer />
        </div>
      </ScrollToTop>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading,
});

export default connect(mapStateToProps)(App);
