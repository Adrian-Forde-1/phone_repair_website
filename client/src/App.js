import React from 'react';
import './styles/styles.css';

//react router dom
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
import IndividualRequest from './components/Client/IndividualRequest';

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
      <Navbar />
      <div className="App">
        {/* <Loading /> */}
        {/* {loading === true && <Loading />} */}
        <Route exact path="/" component={Homepage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        <Route exact path="/admin" component={AdminPage} />

        <Route exact path="/request" component={CreateRequest} />
        <Route exact path="/requests" component={AllClientRequest} />
        <Route
          exact
          path="/requests/:requestId"
          component={IndividualRequest}
        />
        <Footer />
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading,
});

export default connect(mapStateToProps)(App);
