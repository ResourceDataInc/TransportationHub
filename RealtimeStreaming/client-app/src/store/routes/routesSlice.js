import { createSlice } from "@reduxjs/toolkit";
import { getRoutes } from "./routesActions";

const options = {
    name: 'routes',
    initialState: {
        routes: [],
        isLoading: false,
        hasError: false,
    },
    reducers: {},
    extraReducers: (builder) => {},
};

const routesSlice = createSlice(options);

export default routesSlice.reducer;
export const selectRoutes = (state) => state.routes.routes;
