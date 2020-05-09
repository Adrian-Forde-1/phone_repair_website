import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

//Components
import ToastMessage from '../../ToastMessage';
import ToastError from '../../ToastError';
import AllDevices from './AllDevices';

//Redux
import store from '../../../redux/store';

//Actions
import { getAllDevices } from '../../../redux/actions/deviceActions';
import { SET_MESSAGES } from '../../../redux/actions/types';

class IndividualDevice extends Component {
  constructor(props) {
    super(props);

    this.onNameChange = this.onNameChange.bind(this);
    this.onCostChange = this.onCostChange.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.setInitialState = this.setInitialState.bind(this);

    this.state = {
      typeOfRepairs: [],
      initialIndex: null,
      inputIndex: null,
      messages: {},
      errors: {},
    };
  }

  componentDidMount() {
    axios
      .get(`/api/typeOfRepairs/${this.props.device._id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.initialTypeOfRepairs = [...response.data];

        this.setState({
          typeOfRepairs: [...response.data],
          inputIndex: response.data.length,
          initialIndex: response.data.length,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setInitialState = () => {
    axios
      .get(`/api/typeOfRepairs/${this.props.device._id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.initialTypeOfRepairs = [...response.data];

        this.setState({
          typeOfRepairs: [...response.data],
          inputIndex: response.data.length,
          initialIndex: response.data.length,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onNameChange = (e) => {
    const stateTypeOfRepairs = [...this.state.typeOfRepairs];
    const index = e.target.dataset.index;
    stateTypeOfRepairs[index].name = e.target.value;

    this.setState({
      typeOfRepairs: stateTypeOfRepairs,
    });
  };

  onCostChange = (e) => {
    const stateTypeOfRepairs = [...this.state.typeOfRepairs];
    const index = e.target.dataset.index;
    stateTypeOfRepairs[index].cost = e.target.value;

    this.setState({
      typeOfRepairs: stateTypeOfRepairs,
    });
  };

  deleteDevice = (device) => {
    axios
      .delete(`/api/device/${device._id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((device) => {
        store.dispatch(getAllDevices(localStorage.getItem('token')));
        const infoSection = document.querySelector('.admin-info-section');
        var newDevices = [...store.getState().api.devices];

        newDevices = newDevices.filter(
          (device) =>
            device.name.toLowerCase() !== this.props.device.name.toLowerCase()
        );

        ReactDOM.render(<AllDevices devices={newDevices} />, infoSection);
      });
  };

  onSaveChanges = () => {
    axios
      .get(`/api/typeOfRepairs/${this.props.device._id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        response.data.forEach((info, index) => {
          if (
            info.name !== this.state.typeOfRepairs[index].name ||
            info.cost !== this.state.typeOfRepairs[index].cost
          ) {
            axios
              .post(
                `/api/typeOfRepair/${info._id}/update`,
                { typeOfRepair: this.state.typeOfRepairs[index] },
                { headers: { Authorization: localStorage.getItem('token') } }
              )
              .then((response) => {
                this.setState({
                  messages: response.data,
                });
                store.dispatch(getAllDevices(localStorage.getItem('token')));
                store.dispatch({ type: SET_MESSAGES, payload: response.data });
              })
              .catch((error) => {
                console.log(error);
                this.setState({
                  errors: response.data.error,
                });
              });
          }
        });
      })
      .then(() => {
        if (this.state.typeOfRepairs.length > this.state.initialIndex) {
          for (
            let i = this.state.initialIndex;
            i < this.state.typeOfRepairs.length;
            i++
          ) {
            axios
              .post(
                `/api/${this.props.device._id}/typeOfRepair/create`,
                {
                  data: this.state.typeOfRepairs[i],
                  deviceName: this.props.device.name,
                },
                { headers: { Authorization: localStorage.getItem('token') } }
              )
              .then((response) => {
                this.setState({
                  error: {},
                  messages: response.data,
                });
                store.dispatch({ type: SET_MESSAGES, payload: response.data });
              })
              .catch((error) => {
                this.setState({
                  messages: {},
                  error: error.response.data,
                });
              });
          }
          store.dispatch(getAllDevices(localStorage.getItem('token')));
          this.setInitialState();

          const formTypeOfRepairsDivs = document.querySelectorAll(
            '#type-of-repairs div'
          );
          formTypeOfRepairsDivs.forEach((div) => {
            div.remove();
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const deleteTypeOfRepair = async (typeId, e) => {
      const formTypeOfRepairsDivs = document.querySelectorAll(
        '#type-of-repairs div'
      );

      formTypeOfRepairsDivs.forEach((div) => {
        div.remove();
      });
      await axios
        .delete(`/api/typeOfRepair/${typeId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        })
        .then((response) => {
          this.setState({
            errors: {},
            messages: response.data,
          });
        })
        .catch((error) => {
          this.setState({
            messages: {},
            errors: error.response.data,
          });
        });

      axios
        .get(`/api/typeOfRepairs/${this.props.device._id}`, {
          headers: { Authorization: localStorage.getItem('token') },
        })
        .then((response) => {
          this.setState({
            typeOfRepairs: [...response.data],
          });

          this.setInitialState();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const addTypeOfRepair = () => {
      const stateTypeOfRepairs = [...this.state.typeOfRepairs];
      stateTypeOfRepairs.push({ name: '', cost: null });

      this.setState(
        (prevState, props) => ({
          typeOfRepairs: stateTypeOfRepairs,
        }),
        () => {
          const TypeOfRepair = (
            <div className="form-inline">
              <div className="form-input-group">
                <input
                  type="text"
                  name={`name${this.state.inputIndex}`}
                  id={`name${this.state.inputIndex}`}
                  onChange={this.onNameChange}
                  data-index={this.state.inputIndex}
                  placeholder="Type Of Repair"
                  required
                />
                <span></span>
              </div>
              <div className="form-input-group">
                <input
                  type="number"
                  name={`cost${this.state.inputIndex}`}
                  id={`cost${this.state.inputIndex}`}
                  min="0"
                  onChange={this.onCostChange}
                  data-index={this.state.inputIndex}
                  placeholder="Cost"
                  required
                />
                <span></span>
              </div>
            </div>
          );

          this.setState(
            (prevState) => ({
              inputIndex: prevState.inputIndex + 1,
            }),
            () => {
              const formTypeOfRepairs = document.querySelector(
                '#type-of-repairs'
              );
              const element = document.createElement('div');
              element.classList.add(`type-of-repair-${this.state.inputIndex}`);
              formTypeOfRepairs.appendChild(element);

              ReactDOM.render(TypeOfRepair, element);
            }
          );
        }
      );
    };

    return (
      <div className="individual-device">
        {this.state.messages !== null &&
          this.state.messages['typeOfRepair'] && (
            <ToastMessage message={this.state.messages.typeOfRepair} />
          )}
        {this.state.errors !== null && this.state.errors['typeOfRepair'] && (
          <ToastError error={this.state.errors.typeOfRepair} />
        )}
        {this.state.errors !== null && this.state.errors['opps'] && (
          <ToastError error={this.state.errors.opps} />
        )}
        <h1>{this.props.device.name}</h1>
        <div>
          <div className="device-type-of-repairs">
            {this.state.typeOfRepairs.map((type, index) =>
              index < this.state.initialIndex ? (
                <div className="one-line" key={index}>
                  <input
                    type="text"
                    value={type.name}
                    onChange={this.onNameChange}
                    data-index={index}
                  />
                  <input
                    type="number"
                    value={type.cost}
                    onChange={this.onCostChange}
                    data-index={index}
                  />
                  <button
                    onClick={(e) => {
                      deleteTypeOfRepair(type._id, e);
                    }}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                </div>
              ) : (
                <div key={index}></div>
              )
            )}
          </div>
          <div id="type-of-repairs"></div>

          <button className="add-input-field" onClick={addTypeOfRepair}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="device-save-changes-btn" onClick={this.onSaveChanges}>
          <i className="far fa-save"></i>
        </div>
        <div
          className="remove-device-btn"
          onClick={(e) => {
            this.deleteDevice(this.props.device, e);
          }}
        >
          <i className="fas fa-minus"></i>
        </div>
      </div>
    );
  }
}

export default IndividualDevice;
