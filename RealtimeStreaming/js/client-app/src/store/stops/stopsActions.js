import { createAsyncThunk } from "@reduxjs/toolkit";
import { StopsApi } from "../../api/StopsApi";

export const getAllStops = createAsyncThunk(
    'stops/getAllStops',
    async (request) => {
        const api = new StopsApi();
        const data = await api.getAllStops(request);
        return data;
    }
);

export const getStopsWithinMapBounds = createAsyncThunk(
    'stops/getStopsWithinMapBounds',
    async (bounds) => {
        const api = new StopsApi();
        const data = await api.getStopsWithinMapBounds(bounds.north, bounds.east, bounds.south, bounds.west);
        return data;
    }
);
