import {
  SET_ALL_REQUESTS,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_ERRORS,
} from './types';
import axios from 'axios';

export const getAllRequest = (token) => (dispatch) => {
  if (token) {
    dispatch({ type: LOADING_UI });
    axios
      .get('/api/requests', {
        headers: { Authorization: token },
      })
      .then((response) => {
        dispatch({ type: SET_ALL_REQUESTS, payload: response.data });
        dispatch({ type: STOP_LOADING_UI });
        return response;
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: SET_ERRORS, payload: error.response.data });
        dispatch({ type: STOP_LOADING_UI });
      });
  }
};

export const createRequest = (newRequest, history) => (dispatch) => {
  if (newRequest) {
    dispatch({ type: LOADING_UI });
    axios
      .post('/user/request', newRequest, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((response) => {
        dispatch({ type: STOP_LOADING_UI });
        history.push(`/request/${response.data._id}`);
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: SET_ERRORS, payload: error.response.data });
        dispatch({ type: STOP_LOADING_UI });
      });
  }
};

export const deleteRequest = (requestId, history) => (dispatch) => {
  if (requestId) {
    axios
      .delete(`/user/request/${requestId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then(() => {
        history.push('/user/requests');
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: SET_ERRORS, payload: error.response.data });
      });
  }
};
