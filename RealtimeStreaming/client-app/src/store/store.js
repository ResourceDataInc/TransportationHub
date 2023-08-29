import { configureStore, combineReducers } from '@reduxjs/toolkit';
import vehiclesReducer from './vehicles/vehiclesSlice';
import stopsReducer from './stops/stopsSlice';

export default configureStore({
    reducer: combineReducers({
        vehicles: vehiclesReducer,
        stops: stopsReducer,
    })
});
