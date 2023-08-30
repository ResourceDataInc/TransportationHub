import { createAsyncThunk } from "@reduxjs/toolkit";
import { RoutesApi } from "../../api/RoutesApi";

export const getRoutes = createAsyncThunk(
    'routes/getRoutes',
    async () => {
        const api = new RoutesApi();
        const data = await api.getRoutes();
        return data;
    }
);
