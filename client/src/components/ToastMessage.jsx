import React from 'react';

const removeToast = (e) => {
  document.querySelector('.toast-message').remove();
};

function ToastMessage(props) {
  return (
    <div className="toast toast-message">
      {props.message && <div>{props.message}</div>}
    </div>
  );
}

export default ToastMessage;
