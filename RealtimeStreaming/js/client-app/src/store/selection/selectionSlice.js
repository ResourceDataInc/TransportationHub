import { createSlice } from '@reduxjs/toolkit';

const options = {
   name: "selection",
   initialState: {
         routeId: null,
         directionId: null,
   },
   reducers: {
        setSelection(state, action) {
            state.routeId = action.payload.routeId;
            state.directionId = action.payload.directionId;
        },

        clearSelection(state) {
            state.routeId = null;
            state.directionId = null;
        },
   },
}

const selectionSlice = createSlice(options);
export default selectionSlice.reducer

export const selectRouteId = (state) => state.selection.routeId
export const selectDirectionId = (state) => state.selection.directionId

export const {
    setSelection,
    clearSelection,
} = selectionSlice.actions;
