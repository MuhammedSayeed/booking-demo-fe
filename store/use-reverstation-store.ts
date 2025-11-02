import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomConfiguration = {
    room_type_id: string;
    room_view_id: string;
    meal_plan_id: string;
    num_rooms: number;
};

type BookingState = {
    hotel_id: string;
    room_configurations: RoomConfiguration[];
    from_date: string;
    to_date: string;
    adults: number;
    children: number;

    // Actions
    setHotelId: (id: string) => void;
    setRoomConfigurations: (rooms: RoomConfiguration[]) => void;
    setFromDate: (date: string) => void;
    setToDate: (date: string) => void;
    setGuests: (adults: number, children: number) => void;
    resetBooking: () => void;
    getBooking: () => Omit<BookingState, keyof BookingActions>;
};

// Separate the actions type to exclude from getBooking return
type BookingActions = {
    setHotelId: (id: string) => void;
    setRoomConfigurations: (rooms: RoomConfiguration[]) => void;
    setFromDate: (date: string) => void;
    setToDate: (date: string) => void;
    setGuests: (adults: number, children: number) => void;
    resetBooking: () => void;
    getBooking: () => Omit<BookingState, keyof BookingActions>;
};


export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            hotel_id: "",
            room_configurations: [],
            from_date: "",
            to_date: "",
            adults: 0,
            children: 0,

            setHotelId: (id) => set({ hotel_id: id }),
            setRoomConfigurations: (rooms) => set({ room_configurations: rooms }),

            // ✅ New methods that format dates before saving
            setFromDate: (date) => set({ from_date: date }),
            setToDate: (date) => set({ to_date: date }),

            setGuests: (adults, children) => set({ adults, children }),

            resetBooking: () =>
                set({
                    hotel_id: "",
                    room_configurations: [],
                    from_date: "",
                    to_date: "",
                    adults: 0,
                    children: 0,
                }),

            // ✅ Return only data (not actions)
            getBooking: () => {
                const { setHotelId, setRoomConfigurations, setFromDate, setToDate, setGuests, resetBooking, getBooking, ...state } = get();
                return state;
            },
        }),
        { name: "booking-storage" }
    )
);
