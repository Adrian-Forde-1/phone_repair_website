import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

//Components
import ToastMessage from '../ToastMessage';
import ToastError from '../ToastError';
import Page404 from '../404';

//Redux
import { connect } from 'react-redux';
import store from '../../redux/store';

//Actions
import { SET_MESSAGES } from '../../redux/actions/types';
import { getAllDevices } from '../../redux/actions/deviceActions';

class CreateRequest extends Component {
  constructor(props) {
    super(props);

    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.toggleRepair = this.toggleRepair.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeCost = this.changeCost.bind(this);

    this.state = {
      device: null,
      description: '',
      typeOfRepairs: [],
      selectedTypes: [],
      errors: {},
    };
  }

  componentDidMount() {
    axios
      .get('/user/devices', {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.setState({
          device: response.data[0].name,
        });

        axios
          .get(`/user/${response.data[0].name}/typeOfRepairs`, {
            headers: { Authorization: localStorage.getItem('token') },
          })
          .then((response) => {
            this.setState({
              typeOfRepairs: [...response.data],
            });
          });
      });
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleRepair = (type, e) => {
    var currentRepairs = [...this.state.selectedTypes];
    const alreadyAdded = currentRepairs.some(
      (repair) => repair.name === type.name
    );
    if (alreadyAdded)
      currentRepairs = currentRepairs.filter(
        (repair) => repair.name !== type.name
      );
    else {
      currentRepairs.push(type);
    }

    this.setState(
      {
        selectedTypes: currentRepairs,
      },
      this.changeCost
    );
  };

  handleDeviceChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
        selectedTypes: [],
      },
      () => {
        document.querySelector('.request-cost h4').innerHTML = '$0 USD';
        axios
          .get(`/user/${this.state.device}/typeOfRepairs`, {
            headers: { Authorization: localStorage.getItem('token') },
          })
          .then((response) => {
            this.setState({
              typeOfRepairs: [...response.data],
            });
          });
      }
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.selectedTypes.length === 0) {
      let errors = {};
      errors.request = 'You must select a type of repair';
      this.setState({
        errors,
      });
    } else {
      axios
        .post(
          '/user/request',
          {
            device: this.state.device,
            typeOfRepairs: this.state.selectedTypes,
            description: this.state.description,
          },
          { headers: { Authorization: localStorage.getItem('token') } }
        )
        .then((response) => {
          this.setState({
            errors: {},
          });
          this.props.history.push('/');
          store.dispatch({ type: SET_MESSAGES, payload: response.data });
        })
        .catch((error) => {
          this.setState({
            errors: error.response.data,
          });
        });
    }
  };
  changeCost = (e) => {
    var cost = 0;
    this.state.selectedTypes.forEach((type) => {
      cost = cost + type.cost;
    });

    document.querySelector('.request-cost h4').innerHTML = `$${cost} USD`;
  };

  render() {
    if (this.props.user !== undefined) {
      if (this.props.user.role === 'Customer') {
        return (
          <div className="auth-container create-request-container">
            {this.state.errors && this.state.errors.request && (
              <ToastError error={this.state.errors.request} />
            )}
            {this.state.errors && this.state.errors.maxNumCurrentRequest && (
              <ToastError error={this.state.errors.maxNumCurrentRequest} />
            )}

            <form className="form" onSubmit={this.handleSubmit}>
              <h1 className="form-title">Create Request</h1>
              <div className="form-input-group">
                <select
                  name="device"
                  className="request-device"
                  id="device"
                  onChange={this.handleDeviceChange}
                >
                  {this.props.devices &&
                    this.props.devices.map((device) => (
                      <option value={device.name} key={device._id}>
                        {device.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-input-group request-repair-options">
                {this.state.typeOfRepairs !== [] &&
                  this.state.typeOfRepairs.map((type) => (
                    <div key={type._id}>
                      <label htmlFor={type.name}>{type.name}</label>
                      <input
                        type="checkbox"
                        value={type.name}
                        name={type.name}
                        onClick={(e) => {
                          this.toggleRepair(type, e);
                        }}
                      />
                    </div>
                  ))}
              </div>
              <div className="form-input-group">
                <textarea
                  name="description"
                  className="request-textarea"
                  id="description"
                  cols="30"
                  rows="10"
                  maxLength="250"
                  placeholder="Extra Information"
                  onChange={this.handleOnChange}
                  required
                ></textarea>
              </div>
              <div className="request-cost">
                <h4>$0 USD</h4>
              </div>
              <input className="submit-btn" type="submit" />
            </form>
          </div>
        );
      } else return <Page404 />;
    } else return <Page404 />;
  }
}

const mapDispatchToProps = {
  getAllDevices,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  devices: state.api.devices,
  errors: state.UI.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequest);
