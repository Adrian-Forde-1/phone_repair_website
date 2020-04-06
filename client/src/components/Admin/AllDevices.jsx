import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddDevice from './AddDevice';
import ReactDOM from 'react-dom';
import IndividualDevice from './IndividualDevice';

//Redux
import store from '../../redux/store';

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
        <form className="search-bar no-select">
          <input
            type="text"
            name="search"
            placeholder="Search by device's name"
            onChange={this.onSearchChange}
          />
        </form>

        {this.props.devices ? (
          <div className="device-container">
            {this.props.devices.map((device) =>
              this.state.search === '' ? (
                <div
                  className="device"
                  key={device._id}
                  onClick={() => {
                    this.renderIndividualDevice(device);
                  }}
                >
                  <p>{device.name}</p>
                </div>
              ) : (
                device.name
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 && (
                  <div
                    className="device"
                    key={device._id}
                    onClick={() => {
                      this.renderIndividualDevice(device, this.props.messages);
                    }}
                  >
                    <p>{device.name}</p>
                  </div>
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

export default AllDevices;
