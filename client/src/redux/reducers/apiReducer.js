import {
  SET_ALL_USERS,
  SET_ALL_DEVICES,
  SET_ALL_REQUESTS
} from '../actions/types';

const initialState = {
  users: [],
  requests: [],
  devices: []
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_USERS:
      return {
        ...state,
        users: action.payload
      };
    case SET_ALL_DEVICES:
      return {
        ...state,
        devices: action.payload
      };
    case SET_ALL_REQUESTS:
      return {
        ...state,
        requests: action.payload
      };
    default:
      return state;
  }
};

export default apiReducer;
