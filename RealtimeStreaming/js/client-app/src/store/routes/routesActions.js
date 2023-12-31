import { createAsyncThunk } from "@reduxjs/toolkit";
import { RoutesApi } from "../../api/RoutesApi";
import { GeneralApi } from "../../api/GeneralApi";

export const getRoute = createAsyncThunk(
    'routes/getRoute',
    async (request) => {
        const api = new RoutesApi(request.routeId, request.directionId);
        const routePositions = await api.getRoute();

        const routeData = {
            id: request.routeId,
            direction: request.directionId,
            positions: routePositions,
        };

        return routeData;
    }
);

export const getAllRoutes = createAsyncThunk(
    'routes/getAllRoutes',
    async () => {
        const api = new GeneralApi();
        return api.getAllRoutes();
    }
);