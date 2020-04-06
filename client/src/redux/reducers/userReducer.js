import { SET_USER, SET_USER_UNAUTHENTICATED } from '../actions/types';

const initialState = {
  user: {},
  authenticated: false,
  loading: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_UNAUTHENTICATED:
      return {
        initialState
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        authenticated: true,
        loading: false
      };
    default:
      return state;
  }
};

export default userReducer;
