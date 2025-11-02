
import { ReservationState } from "@/interfaces/hotel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ReservationState = {
  hotel_id: '',
  room_configurations: [],
  from_date: "",
  to_date: "",
  adults: 0,
  children: 0,
  special_requests: "",
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setReservation: (state, action: PayloadAction<ReservationState>) => {
      return { ...state, ...action.payload };
    },
    clearReservation: () => initialState,
  },
});

export const { setReservation, clearReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
