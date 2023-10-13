import { createSlice } from '@reduxjs/toolkit';

const options = {
   name: "selection",
   initialState: {
         routeId: null,
         directionId: null,
         color: null,
   },
   reducers: {
        setSelection(state, action) {
            state.routeId = action.payload.routeId;
            state.directionId = action.payload.directionId;
            state.color = action.payload.color;
        },

        clearSelection(state) {
            state.routeId = null;
            state.directionId = null;
            state.color = null;
        },
   },
}

const selectionSlice = createSlice(options);
export default selectionSlice.reducer

export const selectRouteId = (state) => state.selection.routeId
export const selectDirectionId = (state) => state.selection.directionId
export const selectRouteColor = (state) => state.selection.color
export const {
    setSelection,
    clearSelection,
} = selectionSlice.actions;
