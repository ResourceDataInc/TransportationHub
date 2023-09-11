import { createSlice } from "@reduxjs/toolkit";
import { getRoute } from "./routesActions";

const options = {
    name: 'routes',
    initialState: {
        routes: [],
        selectedRoutePositions: [],
        selectedRouteId: 0,
        selectedRouteDirection: 0,
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getRoute.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasError = false;

            state.selectedRoutePositions = action.payload;
        });

        builder.addCase(getRoute.rejected, (state) => {
            state.isLoading = false;
            state.hasError = true;
        });
    },
};

const routesSlice = createSlice(options);

export default routesSlice.reducer;
export const selectRoutes = (state) => state.routes.routes;
export const selectSelectedRoutePositions = (state) => state.routes.selectedRoutePositions;
