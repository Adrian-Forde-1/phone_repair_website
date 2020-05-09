import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { getAllDevices } from '../../../redux/actions/deviceActions';

//Components
import AdminSideBar from '../AdminSideBar';
import IndividualDevice from './IndividualDevice';
import AddDevice from './AddDevice';
import DevicePreview from '../Previews/DevicePreview';

class AllDevices extends Component {
  constructor(props) {
    super(props);

    this.onSearchChange = this.onSearchChange.bind(this);
    this.renderIndividualDevice = this.renderIndividualDevice.bind(this);
    this.addDevice = this.addDevice.bind(this);

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

  renderIndividualDevice = (device, messages) => {
    const infoSection = document.querySelector('.admin-info-section');
    ReactDOM.render(
      <IndividualDevice device={device} messages={messages} />,
      infoSection
    );
  };

  addDevice = () => {
    const infoSection = document.querySelector('.admin-info-section');
    ReactDOM.render(<AddDevice />, infoSection);
  };

  render() {
    return (
      <div className="admin-info-div">
        <AdminSideBar />
        <form className="search-bar no-select">
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

        <div className="add-device-btn" onClick={this.addDevice}>
          <i className="fas fa-plus"></i>
        </div>
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
