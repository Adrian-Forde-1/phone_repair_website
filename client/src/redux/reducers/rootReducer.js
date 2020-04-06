import { combineReducers } from 'redux';
import userReducer from './userReducer';
import uiReducer from './uiReducer';
import apiReducer from './apiReducer';

const rootReducer = combineReducers({
  user: userReducer,
  UI: uiReducer,
  api: apiReducer
});

export default rootReducer;
