import { createSlice } from "@reduxjs/toolkit";
import { getRoute } from "./routesActions";

const options = {
    name: 'routes',
    initialState: {
        routes: [],
        selectedRoutePositions: [],
        selectedRouteId: 0,
        selectedRouteDirection: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getRoute.fulfilled, (state, action) => {
            state.selectedRoutePositions = action.payload;
        });
    },
};

const routesSlice = createSlice(options);

export default routesSlice.reducer;
export const selectRoutes = (state) => state.routes.routes;
export const selectSelectedRoutePositions = (state) => state.routes.selectedRoutePositions;
