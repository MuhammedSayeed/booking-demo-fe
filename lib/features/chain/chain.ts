// store/slices/reservationSlice.ts

import { CompanyChain, ReservationState } from "@/interfaces/hotel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const isAppInDevelopmentMode =
  `${process.env.NEXT_PUBLIC_APP_STATUS}` === "development";
const initialState: CompanyChain = {
  id: -1, //isAppInDevelopmentMode ? -1 :
  name: "Maysan Group",
  description:
    "Maysan is an Arabic name which means the shiny huge star.\r\nMaysan’s star rose up to complete a long journey made by its founders in the hospitality world, in which they spent more than three decades in different cultures in the world of hotel management and Hajj & Umrah companies. Over more than 30 years of dedicated efforts of serving pilgrims Maysan Team succeeded of supplying the best services which has always been in line with all its activities to be a global company striving with pride for leadership and excellence in the management and delivery of tourism programs and supportive services according to the applied regulations through the application of international quality standards to ensure customers loyalty which complies with the greatness of the holy mosque.",
  headquarters: "",
  website: "https://maysangroup.com/about/",
  facebook: "https://maysangroup.com/about/",
  instagram: "https://maysangroup.com/about/",
  mobile_number: "+201110752811",
  phone_number: "0533608771",
  whatsapp_number: "+201110752811",
  email: "ahmed.m.172002@gmail.com",
  logo: "http://bookingengine.onrender.com:8009/media/hotel_chains/maysan-logo-1.png",
  external_system_id: null,
  created_at: "2025-05-14T15:58:01.669742Z",
  updated_at: "2025-05-29T14:09:32.656491Z",
};

const chainSlice = createSlice({
  name: "CompanyChain",
  initialState,
  reducers: {
    setChainSlice: (state, action: PayloadAction<CompanyChain>) => {
      return { ...state, ...action.payload };
    },
    clearChain: () => initialState,
  },
});

export const { setChainSlice, clearChain } = chainSlice.actions;
export default chainSlice.reducer;
