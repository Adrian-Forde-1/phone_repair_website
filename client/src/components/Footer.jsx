import React from 'react';

//react router dom
import { withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

function Footer(props) {
  if (props.location.pathname.indexOf('admin') > -1) return null;
  else {
    if (props.loading === false) return null;
    else {
      return (
        <footer>
          <h2>Cellphone Repairs</h2>
          <div>
            <a target="_blank" href="https://icons8.com/icons/set/iphone-x">
              IPhone X icon
            </a>{' '}
            icon by{' '}
            <a target="_blank" href="https://icons8.com">
              Icons8
            </a>
          </div>

          <div className="footer-contact-info">
            <p>Contact #: 256-765-4321 | 256-123-4567</p>
            <p>Email: CellphoneRepairsEmail@email.com</p>
          </div>

          <p>Copright 2020 &copy;</p>
        </footer>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading,
});

export default connect(mapStateToProps)(withRouter(Footer));
