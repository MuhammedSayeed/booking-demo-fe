// src/store/slices/roomSelectionSlice.ts

import { Room, RoomCombinationsResponse, RoomMealPlan, RoomReservationOption } from "@/interfaces/hotel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomSelectionState {
  selectedRoom: RoomCombinationsResponse | null;
  selectedMealPlan: RoomMealPlan | null;
}

const initialState: RoomSelectionState = {
  selectedRoom: null,
  selectedMealPlan: null,
};

const roomSelectionSlice = createSlice({
  name: "roomSelection",
  initialState,
  reducers: {
    setSelectedRoom: (
      state,
      action: PayloadAction<RoomCombinationsResponse>
    ) => {
      state.selectedRoom = action.payload;
    },
    setSelectedMealPlan: (state, action: PayloadAction<RoomMealPlan>) => {
      state.selectedMealPlan = action.payload;
    },
    clearSelection: (state) => {
      state.selectedRoom = null;
      state.selectedMealPlan = null;
    },
  },
});

export const { setSelectedRoom, setSelectedMealPlan, clearSelection } =
  roomSelectionSlice.actions;

export default roomSelectionSlice.reducer;
