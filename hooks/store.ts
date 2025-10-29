import { create } from "zustand";

export const useUserStore = create((set) => ({
    userData: {},
    isAuthenticated: false,
    isLoading: false,
}));
