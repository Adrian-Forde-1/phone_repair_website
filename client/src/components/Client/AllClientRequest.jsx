import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

//Components
import Page404 from '../404';
import RequestPreview from './RequestPreview';

//readt redux
import { connect } from 'react-redux';
import store from '../../redux/store';

//Action
import { LOADING_UI, STOP_LOADING_UI } from '../../redux/actions/types';

class AllClientRequest extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      allRequests: [],
      filter: 'Pending Acceptance',
      search: '',
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    store.dispatch({ type: LOADING_UI });
    axios
      .get(`/user/${this.props.user._id}/requests`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        store.dispatch({ type: STOP_LOADING_UI });
        this.setState({
          allRequests: [...response.data],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    if (this.props.user !== undefined) {
      if (this.props.user.role === 'Customer') {
        return (
          <div className="client-info-section">
            <form className="search-bar">
              <input
                type="search"
                name="search"
                onChange={this.onChange}
                placeholder="Search by device's name"
              />
              <select name="filter" id="filter" onChange={this.onChange}>
                <option value="Pending Acceptance">Pending Acceptance</option>
                <option value="Awaiting Device">Awaiting Device</option>
                <option value="Being Repaired">Being Repaired</option>
                <option value="Completed">Completed</option>
              </select>
            </form>

            {this.state.allRequests ? (
              <div className="request-container">
                {this.state.search === ''
                  ? this.state.allRequests.map(
                      (request) =>
                        request.status.toLowerCase() ===
                          this.state.filter.toLowerCase() && (
                          <RequestPreview request={request} key={request._id} />
                        )
                    )
                  : this.state.allRequests.map(
                      (request) =>
                        request.status.toLowerCase() ===
                          this.state.filter.toLowerCase() &&
                        request.device
                          .toLowerCase()
                          .indexOf(this.state.search.toLowerCase()) > -1 && (
                          <RequestPreview request={request} key={request._id} />
                        )
                    )}
              </div>
            ) : (
              <div>There are currently no request</div>
            )}
          </div>
        );
      } else return <Page404 />;
    } else return <Page404 />;
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(AllClientRequest);
