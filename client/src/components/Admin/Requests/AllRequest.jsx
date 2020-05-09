import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';

//Actions
import { getAllRequest } from '../../../redux/actions/requestActions';

//Components
import AdminSideBar from '../AdminSideBar';
import SearchAndSelect from '../../Util/SearchAndSelect';
import RequestPreview from '../Previews/RequestPreview';

class AllRequest extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      search: '',
      filter: 'All',
    };
  }

  componentDidMount() {
    this.props.getAllRequest(localStorage.getItem('token'));
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <div className="admin-info-div">
        <AdminSideBar />
        <SearchAndSelect onChange={this.onChange} />

        {this.props.requests ? (
          <div className="request-preview-container">
            {this.state.search === ''
              ? this.state.filter === 'All'
                ? this.props.requests.map((request) => (
                    <RequestPreview request={request} key={request._id} />
                  ))
                : this.props.requests.map(
                    (request) =>
                      request.status.toLowerCase() ===
                        this.state.filter.toLowerCase() && (
                        <RequestPreview request={request} key={request._id} />
                      )
                  )
              : this.props.requests.map((request) =>
                  this.state.filter === 'All'
                    ? request.usersname
                        .toLowerCase()
                        .indexOf(this.state.search.toLowerCase()) > -1 && (
                        <RequestPreview request={request} key={request._id} />
                      )
                    : request.status.toLowerCase() ===
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

const mapDispatchToProps = {
  getAllRequest,
};

const mapStateToProps = (state) => ({
  requests: state.api.requests,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllRequest);
