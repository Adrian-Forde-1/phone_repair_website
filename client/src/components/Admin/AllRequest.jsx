import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RequestPreview from './RequestPreview';

class AllRequest extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      search: '',
      filter: '',
    };
  }

  componentDidMount() {
    this.setState({
      filter: 'Pending Acceptance',
    });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <div className="admin-info-div">
        <form className="search-bar">
          <input
            type="search"
            name="search"
            onChange={this.onChange}
            placeholder="Search by client's name"
          />
          <select name="filter" id="filter" onChange={this.onChange}>
            <option value="Pending Acceptance">Pending</option>
            <option value="Awaiting Device">Awaiting Device</option>
            <option value="Being Repaired">Being Repaired</option>
            <option value="Completed">Completed</option>
          </select>
        </form>

        {this.props.requests ? (
          <div className="request-container">
            {this.state.search === ''
              ? this.props.requests.map(
                  (request) =>
                    request.status.toLowerCase() ===
                      this.state.filter.toLowerCase() && (
                      <RequestPreview request={request} key={request._id} />
                    )
                )
              : this.props.requests.map(
                  (request) =>
                    request.status.toLowerCase() ===
                      this.state.filter.toLowerCase() &&
                    request.usersname
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
  }
}

export default AllRequest;
