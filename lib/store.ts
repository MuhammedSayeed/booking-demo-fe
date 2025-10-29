import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import reservationReducer from "./features/reservation/reservationSlice";
import roomSelectionReducer from "./features/RoomsMealData/RoomsMealData";
import chainSelectionReducer from "./features/chain/chain";
import searchDateSlice from "./features/SearchDate/SearchDate";
export const makeStore = () => {
  return configureStore({
    reducer: {
      chainSlice: chainSelectionReducer,
      roomSelection: roomSelectionReducer,
      reservation: reservationReducer,
      user: userReducer,
      searchDateSlice: searchDateSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // 👇 استثني المسارات اللي فيها تواريخ
          ignoredPaths: ["searchDateSlice.from", "searchDateSlice.to"],
          ignoredActionPaths: ["payload.from", "payload.to"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
