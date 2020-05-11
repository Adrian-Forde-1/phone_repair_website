import React, { Component } from 'react';
// import PropTypes from 'prop-types';

//react router dom
import { Link } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import store from '../redux/store';

//Actions
import { STOP_LOADING_UI } from '../redux/actions/types';

//Resources
import Clock_Logo from '../resources/logos/Clock_Logo.svg';
import Fix_Logo from '../resources/logos/Fix_Logo.svg';
import Service_Logo from '../resources/logos/Service_Logo.svg';
import Iphone_header_img from '../resources/images/iphone_header_img.png';
import testimonial_1 from '../resources/images/testimonial_1.jpg';
import testimonial_2 from '../resources/images/testimonial_2.jpg';
import Who from '../resources/images/Who.svg';

class Homepage extends Component {
  componentDidMount() {
    store.dispatch({ type: STOP_LOADING_UI });
  }
  render() {
    const { user, authenticated } = this.props;
    return (
      <div className="homepage-content">
        <div className="homepage-header">
          <div>
            <div className="header-text">
              <div className="header-content">
                <h2>Cellphone Repairs</h2>
                <p>
                  #1 Online Phone Repair Service. Quick, reliable and precise,
                  we strive to make our customers happy and be their first
                  choice for any device repairs
                </p>
                <button className="call-to-action-btn">
                  {authenticated === true ? (
                    user.role === 'Customer' ? (
                      <Link to="/request">Create a Request</Link>
                    ) : (
                      <Link to="/admin/requests">Requests</Link>
                    )
                  ) : (
                    <Link to="/signup">Sign Up</Link>
                  )}
                </button>
              </div>
            </div>
          </div>
          <img src={Iphone_header_img} alt="" />
        </div>
        <section>
          <h1 className="section-heading">Who Are We</h1>
          <div className="about-us">
            <img src={Who} alt="Who" />
            <p>
              Ever since 2005, Cellphone Repairs has been in the cellphone
              repair business. Yeah... that's a long time. By being here so long
              we've evolved and come to understand exactly what the customer
              wants. From the oldest to the newest phones. We got you. With
              quick and effective workers, it'll be like your device was never
              gone. Our company has grown from one guy to an entire empire.
              Taking on all the competition over the years have thought us
              valuable lessons that we apply with every device we repair,
              ensuring that when that device gets back into the hands of the
              person who sent it, it will make them smile.
            </p>
          </div>
        </section>
        <section>
          <h1 className="section-heading">Our Main Focus</h1>
          <div className="quirks">
            <div className="quirk-item">
              <img src={Fix_Logo} alt="Fix Logo" />
              <h3>Percision and Quality</h3>
              <p>
                By continuously assessing our equipment and skillsets, we are
                able to stay on top of the game and above our competition
                providing the customer with quality of work they'll find nowhere
                else
              </p>
            </div>
            <div className="quirk-item">
              <img src={Clock_Logo} alt="Clock Logo" />
              <h3>Quick Repairs</h3>
              <p>
                With experience and a keen eye comes speed. Our workers are
                ready to tackle any problem thrown their way at full throttle
              </p>
            </div>
            <div className="quirk-item">
              <img src={Service_Logo} alt="Service Logo" />
              <h3>Great Customer Service</h3>
              <p>
                Need help? Contact Us. We are hear to make your repairs easier
                and stress free. Our friendly customer service representatives
                are hear to help you out and maybe even brighten up your day
              </p>
            </div>
          </div>
        </section>
        <section>
          <h1 className="section-heading">Testimonials</h1>
          <div className="testimonials">
            <div className="testimonial-item">
              <div className="testimonial-img">
                <img
                  className="testimonial-img"
                  src={testimonial_1}
                  alt="Testimonial"
                />
              </div>
              <p>
                <span>"</span> Fast and efficent. Sent my phone in for repair
                and it was ready for pickup later that same day. These guys know
                what they are doing! <span>"</span>
              </p>
            </div>
            <div className="testimonial-item">
              <div className="testimonial-img">
                <img src={testimonial_2} alt="Testimonial" />
              </div>
              <p>
                <span>"</span> Customer service is top notch. Whenever I need to
                get extra information, there's always someone there to help.{' '}
                <span>"</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

// Homepage.propTypes = {
//   getUserData: PropTypes.func
// };

const mapStateToProps = (state) => ({
  user: state.user.user,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Homepage);
