import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';

//react router dom
import { Link } from 'react-router-dom';

//Actions
import { loginUser } from '../redux/actions/userActions';
import ToastError from './ToastError';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
    };
  }
  componentWillMount() {
    if (this.props.authenticated === true) this.props.history.push('/');
  }

  componentDidMount() {
    const inputs = document.querySelectorAll('.form-input-group input');
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

  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(user, this.props.history);
    console.log(this.props.errors);
  };

  render() {
    // const { errors } = this.props;
    // console.log(this.props);
    // console.log(errors);
    // console.log(typeof this.props.errors);

    return (
      <div className="auth-container">
        {this.props.errors !== null && this.props.errors['general'] && (
          <ToastError error={this.props.errors.general} />
        )}

        <form className="form" onSubmit={this.handleSubmit}>
          <h1 className="form-title">Login</h1>
          <div className="form-input-group">
            <input
              type="email"
              name="email"
              id="email"
              onChange={this.handleChange}
              placeholder="Email"
            />
            <span></span>
          </div>
          <div className="form-input-group">
            <input
              type="password"
              name="password"
              id="password"
              onChange={this.handleChange}
              placeholder="Password"
            />
            <span></span>
          </div>
          <input className="submit-btn" type="submit" />

          <div className="bottom-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  authenticated: PropTypes.bool,
};

const mapStateToPtops = (state) => ({
  authenticated: state.user.authenticated,
  errors: state.UI.errors,
});

const mapDispatchToProps = {
  loginUser,
};

export default connect(mapStateToPtops, mapDispatchToProps)(Login);
