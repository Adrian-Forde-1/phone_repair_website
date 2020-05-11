import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { getAllDevices } from '../../../redux/actions/deviceActions';
import { setErrors, setMessages } from '../../../redux/actions/userActions';

//Components
import ToastMessage from '../../ToastMessage';
import ToastError from '../../ToastError';
import AdminSideBar from '../AdminSideBar';

class IndividualDevice extends Component {
  constructor(props) {
    super(props);

    this.onNameChange = this.onNameChange.bind(this);
    this.onCostChange = this.onCostChange.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.setInitialState = this.setInitialState.bind(this);

    this.state = {
      device: {},
      typeOfRepairs: [],
      initialIndex: null,
      inputIndex: null,
      messages: {},
      errors: {},
    };
  }

  componentDidMount() {
    const deviceId = this.props.match.params.deviceId;
    axios
      .get(`/api/device/${deviceId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        this.setState({
          device: response.data,
        });
      })
      .catch((error) => {
        this.props.setErrors(error);
        this.props.history.goBack();
      });
    axios
      .get(`/api/typeOfRepairs/${deviceId}`, {
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
        this.props.setErrors(error);
        console.log(error);
        this.props.history.goBack();
      });
  }

  setInitialState = () => {
    axios
      .get(`/api/typeOfRepairs/${this.state.device._id}`, {
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
        this.props.setErrors(error);
        console.log(error);
        this.props.history.goBack();
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
      .then(() => {
        this.props.getAllDevices(localStorage.getItem('token'));
        this.props.history.replace('/admin/devices');
      });
  };

  onSaveChanges = () => {
    axios
      .get(`/api/typeOfRepairs/${this.state.device._id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        response.data.forEach((info, index) => {
          if (
            info.name !== this.state.typeOfRepairs[index].name ||
            info.cost !== this.state.typeOfRepairs[index].cost
          ) {
            axios
              .put(
                `/api/typeOfRepair/${info._id}/update`,
                { typeOfRepair: this.state.typeOfRepairs[index] },
                { headers: { Authorization: localStorage.getItem('token') } }
              )
              .then((response) => {
                this.setState({
                  messages: response.data,
                });
              })
              .catch((error) => {
                this.props.setErrors(error);
                console.log(error);
                this.props.history.goBack();
              });
          }
        });
        this.props.getAllDevices(localStorage.getItem('token'));
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
                `/api/${this.state.device._id}/typeOfRepair/create`,
                {
                  data: this.state.typeOfRepairs[i],
                  deviceName: this.state.device.name,
                },
                { headers: { Authorization: localStorage.getItem('token') } }
              )
              .then((response) => {
                this.setState({
                  error: {},
                  messages: response.data,
                });
                this.props.setMessages(response);
              })
              .catch((error) => {
                this.props.setErrors(error);
                console.log(error);
                this.props.history.goBack();
              });
          }
          this.props.getAllDevices(localStorage.getItem('token'));
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
        this.props.setErrors(error);
        console.log(error);
        this.props.history.goBack();
      });
  };

  render() {
    const deviceId = this.props.match.params.deviceId;

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
          this.props.setErrors(error);
          console.log(error);
          this.props.history.goBack();
        });

      axios
        .get(`/api/typeOfRepairs/${deviceId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        })
        .then((response) => {
          this.setState({
            typeOfRepairs: [...response.data],
          });

          this.setInitialState();
        })
        .catch((error) => {
          this.props.setErrors(error);
          console.log(error);
          this.props.history.goBack();
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
      Object.keys(this.state.device).length > 0 && (
        <div className="individual-device p-l-75">
          <AdminSideBar />
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
          <h1>{this.state.device.name}</h1>
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
              this.deleteDevice(this.state.device, e);
            }}
          >
            <i className="fas fa-minus"></i>
          </div>
        </div>
      )
    );
  }
}

const mapDispatchToProps = {
  setErrors,
  getAllDevices,
  setMessages,
};

export default connect(null, mapDispatchToProps)(IndividualDevice);
