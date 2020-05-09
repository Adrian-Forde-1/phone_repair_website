import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';

//Actios
import { getAllUsers } from '../../../redux/actions/userActions';

//Components
import IndividualUser from './IndividualUser';
import AdminSideBar from '../AdminSideBar';
import SearchBar from '../../Util/SearchBar';
import UserPreview from '../Previews/UserPreview';

class AllUsers extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      search: '',
    };
  }

  componentDidMount() {
    this.props.getAllUsers(localStorage.getItem('token'));
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      console.log(this.props.users);
    }
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
        <SearchBar onChange={this.onChange} />
        {this.props.users ? (
          <div className="user-preview-container">
            {this.props.users.map((user) =>
              this.state.search === '' ? (
                <UserPreview user={user} key={user._id} />
              ) : (
                user.fullname
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 && (
                  <UserPreview user={user} key={user._id} />
                )
              )
            )}
          </div>
        ) : (
          <div>There are currently no users</div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  getAllUsers,
};

const mapStateToProps = (state) => ({
  users: state.api.users,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
