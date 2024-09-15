import { create } from "zustand";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";
import { persist } from "zustand/middleware";

export type NFCPreferencesStore = {
  preferencesData: SaveNFCPreferences;
  setPreferences: (data: NFCPreferencesStore["preferencesData"]) => void;
};

export const nfcPreferencesStore = create(
  persist<NFCPreferencesStore>(
    (set) => ({
      preferencesData: {
        showName: true,
        showJobTitle: false,
        showCompanyLogo: false,
        nameOnFront: true,
        jobTitleOnFront: true,
        companyLogoOnFront: true,
        cardVariant: "custom",
        companyLogoURL: undefined,
      },
      setPreferences: (data) => set({ preferencesData: data }),
    }),
    {
      name: "nfc-preferences",
    },
  ),
);
