import React from 'react';

const removeToast = (e) => {
  document.querySelector('.toast-error').remove();
};

const ToastError = (props) => {
  return <div className="toast toast-error">{props.error && props.error}</div>;
};

export default ToastError;
