import {
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  STOP_LOADING_UI,
  SET_MESSAGES,
  CLEAR_MESSAGES
} from '../actions/types';

const initialState = {
  loading: false,
  errors: null,
  messages: null
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      };
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case SET_MESSAGES:
      return {
        ...state,
        loading: false,
        messages: action.payload
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        loading: false,
        messages: {}
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {}
      };
    default:
      return state;
  }
};

export default uiReducer;
