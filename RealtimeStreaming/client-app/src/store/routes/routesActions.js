import { createAsyncThunk } from "@reduxjs/toolkit";
import { RoutesApi } from "../../api/RoutesApi";

export const getRoutes = createAsyncThunk(
    'routes/getRoute',
    async () => {
        const api = new RoutesApi();
        const data = await api.getRoute();
        return data;
    }
);
