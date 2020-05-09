import React from 'react';

//React Router DOM
import { Link, withRouter } from 'react-router-dom';

function DevicePreview(props) {
  return (
    <div className="device-preview">
      <Link to={`/admin/device/${props.device._id}`}>
        <p>{props.device.name}</p>
      </Link>
    </div>
  );
}

export default withRouter(DevicePreview);
