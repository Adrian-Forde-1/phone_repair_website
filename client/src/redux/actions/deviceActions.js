import {
  SET_ALL_DEVICES,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_ERRORS
} from './types';
import axios from 'axios';

export const getAllDevices = token => dispatch => {
  if (token) {
    dispatch({ type: LOADING_UI });
    axios
      .get('/api/devices', {
        headers: { Authorization: token }
      })
      .then(response => {
        dispatch({ type: SET_ALL_DEVICES, payload: response.data });
        dispatch({ type: STOP_LOADING_UI });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: SET_ERRORS, payload: error.response.data });
        dispatch({ type: STOP_LOADING_UI });
      });
  }
};

export const getAllTypeOfRepairs = (token, deviceId) => dispatch => {
  if (token) {
    dispatch({ type: LOADING_UI });
    axios.get(`/api/typeOfRepairs/${deviceId}`, {
      headers: { Authorization: token }
    });
  }
};
