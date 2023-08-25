import { configureStore, combineReducers } from '@reduxjs/toolkit';
import busesReducer from './buses/busesSlice';

export default configureStore({
    reducer: combineReducers({
        buses: busesReducer,
    })
});
