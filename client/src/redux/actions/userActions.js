//Action types
import {
  SET_USER,
  SET_ALL_USERS,
  SET_USER_UNAUTHENTICATED,
  SET_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  CLEAR_ERRORS,
  SET_MESSAGES,
} from './types';

//Axios
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/user/login', userData)
    .then((response) => {
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      dispatch(getUserData());
      dispatch({ type: STOP_LOADING_UI });
      history.push('/');
    })
    .catch((error) => {
      if (error.response.data === 'Unauthorized') {
        dispatch({
          type: SET_ERRORS,
          payload: { general: 'Wrong Credentials' },
        });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: error.response,
        });
      }
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/user/signup', { data: newUserData })
    .then((response) => {
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      dispatch({ type: STOP_LOADING_UI });
      history.push('/login');
    })
    .catch((error) => {
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    });
};

export const logoutUser = (history) => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: SET_USER_UNAUTHENTICATED });
  history.push('/login');
};

export const getUserData = () => (dispatch) => {
  if (localStorage.getItem('token')) {
    dispatch({ type: LOADING_UI });
    axios
      .get('/user', {
        headers: { Authorization: localStorage.getItem('token') },
      })
      .then((user) => {
        dispatch({ type: SET_USER, payload: user.data });
        dispatch({ type: CLEAR_ERRORS });
        dispatch({ type: STOP_LOADING_UI });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: SET_ERRORS, payload: error.response.data });
      });
  }
};

export const getAllUsers = (token) => (dispatch) => {
  if (token) {
    dispatch({ type: LOADING_UI });
    axios
      .get('/api/users', { headers: { Authorization: token } })
      .then((response) => {
        dispatch({ type: SET_ALL_USERS, payload: response.data });
        dispatch({ type: STOP_LOADING_UI });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: SET_ERRORS, payload: error.response.data });
        dispatch({ type: STOP_LOADING_UI });
      });
  }
};

export const setErrors = (error) => (dispatch) => {
  dispatch({ type: SET_ERRORS, payload: error.response.data });
};
export const setMessages = (message) => (dispatch) => {
  dispatch({ type: SET_MESSAGES, payload: message.data });
};

export const setLoadingUI = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
};

export const stopLoadingUI = () => (dispatch) => {
  dispatch({ type: STOP_LOADING_UI });
};
