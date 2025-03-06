import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      activeTab: "info",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "tab-storage", // LocalStorage key
    }
  )
);
