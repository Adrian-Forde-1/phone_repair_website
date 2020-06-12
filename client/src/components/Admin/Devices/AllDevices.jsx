import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

//React Router DOM
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { getAllDevices } from '../../../redux/actions/deviceActions';

//Components
import AdminSideBar from '../AdminSideBar';
import IndividualDevice from './IndividualDevice';
import DevicePreview from '../Previews/DevicePreview';

class AllDevices extends Component {
  constructor(props) {
    super(props);

    this.onSearchChange = this.onSearchChange.bind(this);

    this.state = {
      search: '',
    };
  }

  componentDidMount() {
    this.props.getAllDevices(localStorage.getItem('token'));
  }

  onSearchChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  render() {
    return (
      <div className="admin-info-div">
        <AdminSideBar />
        <form className="search-bar admin-search no-select">
          <input
            type="text"
            name="search"
            placeholder="Search by device's name"
            onChange={this.onSearchChange}
          />
        </form>

        {this.props.devices ? (
          <div className="device-preview-container">
            {this.props.devices.map((device) =>
              this.state.search === '' ? (
                <DevicePreview device={device} key={device._id} />
              ) : (
                device.name
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 && (
                  <DevicePreview device={device} key={device._id} />
                )
              )
            )}
          </div>
        ) : (
          <div>There are currently no devices</div>
        )}

        <Link to="/admin/adddevice" className="add-device-btn">
          <i className="fas fa-plus"></i>
        </Link>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getAllDevices,
};

const mapStateToProps = (state) => ({
  devices: state.api.devices,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllDevices);
