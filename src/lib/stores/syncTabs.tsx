import { create } from "zustand";

export const syncTabsStore = create((set) => ({
  selectedTab: "links",
  setSelectedTab: (tab: "links" | "contact") => set({ selectedTab: tab }),
}));
