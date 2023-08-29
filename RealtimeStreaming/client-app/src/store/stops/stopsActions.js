import { createAsyncThunk } from "@reduxjs/toolkit";
import { StopsApi } from "../../api/StopsApi";

export const getStops = createAsyncThunk(
    'stops/getStops',
    async () => {
        const api = new StopsApi;
        const data = await api.getStops();
        return data;
    }
);
