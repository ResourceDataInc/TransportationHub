import { createSlice } from "@reduxjs/toolkit";
import { getRoute, getAllRoutes } from "./routesActions";

const options = {
    name: 'routes',
    initialState: {
        routes: [],
        selectedRouteId: 0,
        selectedRouteDirection: 0,
        selectedRoutePositions: [],
    },
    reducers: {
        clearRouteData(state) {
            state.selectedRouteId = 0;
            state.selectedRouteDirection = 0;
            state.selectedRoutePositions = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getRoute.fulfilled, (state, action) => {
            state.selectedRouteId = Number(action.payload.id);
            state.selectedRouteDirection = Number(action.payload.direction);
            state.selectedRoutePositions = action.payload.positions;
        });
        builder.addCase(getAllRoutes.fulfilled, (state, action) => {
            state.routes = action.payload;
        });
    },
};

const routesSlice = createSlice(options);

export default routesSlice.reducer;
export const selectSelectedRouteId = state => state.routes.selectedRouteId;
export const selectSelectedRoutePositions = state => state.routes.selectedRoutePositions;
export const selectAllRoutes = state => state.routes.routes;
export const { clearRouteData } = routesSlice.actions;
