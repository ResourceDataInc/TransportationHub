import { configureStore, combineReducers } from '@reduxjs/toolkit';
import vehiclesReducer from './vehicles/vehiclesSlice';
import stopsReducer from './stops/stopsSlice';
import routesReducer from './routes/routesSlice';

export default configureStore({
    reducer: combineReducers({
        vehicles: vehiclesReducer,
        stops: stopsReducer,
        routes: routesReducer,
    })
});
