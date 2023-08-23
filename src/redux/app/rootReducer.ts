import { combineReducers } from 'redux';

import userReducer from '../features/userSlice';
import instituteReducer from '../features/instituteSlice';

const rootReducer = combineReducers({
    auth: userReducer,
    institute : instituteReducer
});

export default rootReducer;