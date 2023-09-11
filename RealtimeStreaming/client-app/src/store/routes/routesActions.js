import { createAsyncThunk } from "@reduxjs/toolkit";
import { RoutesApi } from "../../api/RoutesApi";

export const getRoute = createAsyncThunk(
    'routes/getRoute',
    async (request) => {
        const api = new RoutesApi(request.routeId, request.directionId);
        const data = await api.getRoute();
        return data;
    }
);
