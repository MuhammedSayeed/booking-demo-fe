import { User } from "@/interfaces/hotel";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
  id: 0,
  address: "",
  country_details: {
    id: 0,
    name: "",
    code: "",
    phone_code: "",
    nationality: "",
  },
  created_at: "",
  date_of_birth: "",
  email: "",
  first_name: "",
  last_name: "",
  passport_number: "",
  phone: "",
  updated_at: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const isAuthenticated = (state: User) => state.id > 0;

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
