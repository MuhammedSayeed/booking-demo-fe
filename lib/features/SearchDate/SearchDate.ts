// store/slices/SearchDate.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface SearchDate {
  from: Date | undefined;
  to: Date | undefined;
  guests?: string;
  city?: string;
}
const initialState: SearchDate = {
  from: undefined,
  to: undefined,
  guests: "",
  city: "",
};

const searchDateSlice = createSlice({
  name: "SearchDate",
  initialState,
  reducers: {

    setSearchDateSlice: (state, action: PayloadAction<SearchDate>) => {
      return { ...state, ...action.payload };
    },
    clearSearchDate: () => initialState,
  },
});

export const { setSearchDateSlice, clearSearchDate } = searchDateSlice.actions;
export default searchDateSlice.reducer;
