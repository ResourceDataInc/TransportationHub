import { createSlice } from "@reduxjs/toolkit";
import { getRoute, getAllRoutes } from "./routesActions";

const options = {
    name: 'routes',
    initialState: {
        routes: [],
        selectedRouteId: 0,
        selectedRouteDirection: 0,
        selectedRoutePositions: [],
        center: {},
        routeSelectedComplete: false,
    },
    reducers: {
        clearRouteData(state) {
            state.selectedRouteId = 0;
            state.selectedRouteDirection = 0;
            state.selectedRoutePositions = [];
            state.center = {};
            state.routeSelectedComplete = false;
        },
        setRouteSelected(state, action){
            state.routeSelectedComplete = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getRoute.fulfilled, (state, action) => {
            state.selectedRouteId = Number(action.payload.id);
            state.selectedRouteDirection = Number(action.payload.direction);
            const positions = action.payload.positions;
            const averageArr = (arrayOfArrays, inner) => {
                let summation = 0;
                let totalLength = 0;
                for(let array of arrayOfArrays){
                    for(let position of array){
                        summation += position[inner];
                        totalLength += 1;
                    }
                }
                return summation/totalLength;
            };
            state.selectedRoutePositions = positions;
            state.center = {
                lat: averageArr(positions,0),
                lng: averageArr(positions,1),
            };
            state.routeSelectedComplete = true;
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
export const selectRouteCenter = state => state.routes.center;
export const routeSelectedComplete = state => state.routes.routeSelectedComplete;
export const { clearRouteData, setRouteSelected } = routesSlice.actions;
