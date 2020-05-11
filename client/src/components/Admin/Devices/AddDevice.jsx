import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

//Redux
import { connect } from 'react-redux';

//Actions
import { getAllDevices } from '../../../redux/actions/deviceActions';

//Components
import ToastMessage from '../../ToastMessage';
import ToastError from '../../ToastError';
import AdminSideBar from '../AdminSideBar';

class AddDevice extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameTypeChange = this.handleNameTypeChange.bind(this);
    this.handleCostTypeChange = this.handleCostTypeChange.bind(this);

    this.state = {
      deviceName: '',
      typeOfRepairs: [],
      inputIndex: 0,
      messages: {},
      errors: {},
    };
  }

  componentDidMount() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('focusin', () => {
        input.classList.add('focus');
      });
    });

    inputs.forEach((input) => {
      input.addEventListener('focusout', () => {
        input.classList.remove('focus');
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleNameTypeChange = (e) => {
    const index = e.target.name[e.target.name.length - 1];
    const stateTypeOfRepairs = [...this.state.typeOfRepairs];
    stateTypeOfRepairs[index].name = e.target.value;

    this.setState({
      typeOfRepairs: stateTypeOfRepairs,
    });
  };

  handleCostTypeChange = (e) => {
    const index = e.target.name[e.target.name.length - 1];
    const stateTypeOfRepairs = [...this.state.typeOfRepairs];
    stateTypeOfRepairs[index].cost = e.target.value;

    this.setState({
      typeOfRepairs: stateTypeOfRepairs,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        '/api/device',
        {
          device: this.state.deviceName,
          typeOfRepairs: this.state.typeOfRepairs,
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      .then((response) => {
        this.props.getAllDevices(localStorage.getItem('token'));

        this.setState({
          deviceName: '',
          typeOfRepairs: [],
          inputIndex: 0,
          messages: response.data,
          errors: {},
        });

        const formTypeOfRepairsDivs = document.querySelectorAll(
          '#type-of-repairs div'
        );
        formTypeOfRepairsDivs.forEach((div) => {
          div.remove();
        });
      })
      .catch((error) => {
        this.setState({
          messages: {},
          errors: error.response.data,
        });
        console.log(error.response);
      });
  };

  render() {
    const addTypeOfRepair = () => {
      const TypeOfRepair = (
        <div className="form-inline">
          <div className="form-input-group">
            <input
              type="text"
              name={`name${this.state.inputIndex}`}
              id={`name${this.state.inputIndex}`}
              onChange={this.handleNameTypeChange}
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
              onChange={this.handleCostTypeChange}
              data-index={this.state.inputIndex}
              placeholder="Cost"
              required
            />
            <span></span>
          </div>
        </div>
      );

      this.setState((prevState, props) => ({
        inputIndex: prevState.inputIndex + 1,
      }));

      const stateTypeOfRepairs = [...this.state.typeOfRepairs];
      stateTypeOfRepairs.push({ name: '', cost: null });

      this.setState({
        typeOfRepairs: stateTypeOfRepairs,
      });

      const formTypeOfRepairs = document.querySelector('#type-of-repairs');
      const element = document.createElement('div');
      element.classList.add(`type-of-repair-${this.state.inputIndex}`);
      formTypeOfRepairs.appendChild(element);

      ReactDOM.render(TypeOfRepair, element);
    };
    return (
      <div className="auth-container p-l-75">
        <AdminSideBar />
        {Object.keys(this.state.messages).length > 0 &&
          this.state.messages['device'] !== null && (
            <ToastMessage message={this.state.messages.device} />
          )}
        {Object.keys(this.state.messages).length > 0 &&
          this.state.messages['typeOfRepair'] && (
            <ToastMessage message={this.state.messages.typeOfRepair} />
          )}
        {Object.keys(this.state.errors).length > 0 &&
          this.state.errors['device'] !== null && (
            <ToastError error={this.state.errors.device} />
          )}
        <form className="form" onSubmit={this.handleSubmit}>
          <h1 className="form-title">Add Device</h1>
          <div className="form-input-group">
            <input
              type="text"
              name="deviceName"
              id="deviceName"
              onChange={this.handleChange}
              placeholder="Device Name"
              value={this.state.deviceName}
              required
            />
            <span></span>
          </div>
          <div id="type-of-repairs"></div>

          <button className="add-input-field" onClick={addTypeOfRepair}>
            <i className="fas fa-plus"></i>
          </button>
          <input className="submit-btn" type="submit" value="Add" />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getAllDevices,
};

export default connect(null, mapDispatchToProps)(AddDevice);
