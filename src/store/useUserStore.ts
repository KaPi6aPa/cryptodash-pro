import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  name: string;
  email: string;
  notifications: boolean;
  sound: boolean;
  updateProfile: (name: string, email: string) => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "Alex Trader",
      email: "alex@cryptodash.io",
      notifications: true,
      sound: true,
      updateProfile: (name, email) => set({ name, email }),
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
      toggleSound: () => set((state) => ({ sound: !state.sound })),
    }),
    { name: "user-store" }
  )
);
