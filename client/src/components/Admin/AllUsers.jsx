import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//Components
import IndividualUser from './IndividualUser';

class AllUsers extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      search: '',
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  renderIndividualUser = (user) => {
    const infoSection = document.querySelector('.admin-info-section');
    ReactDOM.render(<IndividualUser user={user} />, infoSection);
  };

  render() {
    return (
      <div className="admin-info-div">
        <form className="search-bar no-select">
          <input
            type="text"
            name="search"
            placeholder="Search by user's name"
            onChange={this.onChange}
          />
        </form>
        {this.props.users ? (
          <div className="user-container">
            {this.props.users.map((user) =>
              this.state.search === '' ? (
                <div
                  className="user"
                  key={user._id}
                  onClick={() => {
                    this.renderIndividualUser(user);
                  }}
                >
                  <p>
                    {user.fname} {user.lname}
                  </p>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                </div>
              ) : (
                (user.fname + ' ' + user.lname)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 && (
                  <div
                    className="user"
                    key={user._id}
                    onClick={() => {
                      this.renderIndividualUser(user);
                    }}
                  >
                    <p>
                      {user.fname} {user.lname}
                    </p>
                    <p>{user.email}</p>
                    <p>{user.role}</p>
                  </div>
                )
              )
            )}
          </div>
        ) : (
          <div>There are currently no devices</div>
        )}
      </div>
    );
  }
}

export default AllUsers;
