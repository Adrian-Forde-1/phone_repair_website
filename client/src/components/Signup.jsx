import React, { Component } from 'react';
import PropTypes from 'prop-types';

//react router dom
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//Actions
import { signupUser } from '../redux/actions/userActions';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      fname: '',
      lname: '',
      email: '',
      password: '',
      confirmPassword: '',
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
      fname: this.state.fname,
      lname: this.state.lname,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    this.props.signupUser(user, this.props.history);
    // this.props.loginUser(user, this.props.history);
  };

  render() {
    return (
      <div className="auth-container">
        <form className="form" onSubmit={this.handleSubmit}>
          <h1 className="form-title">Sign Up</h1>
          <div className="form-inline">
            <div className="form-input-group">
              <input
                type="text"
                name="fname"
                id="fname"
                onChange={this.handleChange}
                placeholder="First Name"
              />
              <span></span>
              {this.props.errors.fname && (
                <div className="form-input-error">
                  {this.props.errors.fname}
                </div>
              )}
            </div>
            <div className="form-input-group">
              <input
                type="text"
                name="lname"
                id="lname"
                onChange={this.handleChange}
                placeholder="Last Name"
              />
              <span></span>
              {this.props.errors.lname && (
                <div className="form-input-error">
                  {this.props.errors.lname}
                </div>
              )}
            </div>
          </div>

          <div className="form-input-group">
            <input
              type="email"
              name="email"
              id="email"
              onChange={this.handleChange}
              placeholder="Email"
            />
            <span></span>
            {this.props.errors.email && (
              <div className="form-input-error">{this.props.errors.email}</div>
            )}
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
            {this.props.errors.password && (
              <div className="form-input-error">
                {this.props.errors.password}
              </div>
            )}
          </div>
          <div className="form-input-group">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              onChange={this.handleChange}
              placeholder="Confirm Password"
            />
            <span></span>
            {this.props.errors.confirmPassword && (
              <div className="form-input-error">
                {this.props.errors.confirmPassword}
              </div>
            )}
          </div>
          <input className="submit-btn" type="submit" />

          <div className="bottom-text">
            Have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  errors: state.UI.errors,
});

const mapDispatchToProps = {
  signupUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
