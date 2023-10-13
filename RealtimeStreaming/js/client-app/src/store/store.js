import { configureStore, combineReducers } from '@reduxjs/toolkit';
import vehiclesReducer from './vehicles/vehiclesSlice';
import stopsReducer from './stops/stopsSlice';
import routesReducer from './routes/routesSlice';
import selectionReducer from './selection/selectionSlice';

export default configureStore({
    reducer: combineReducers({
        vehicles: vehiclesReducer,
        stops: stopsReducer,
        routes: routesReducer,
        selection: selectionReducer,
    })
});
