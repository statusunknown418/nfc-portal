import { create } from "zustand";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";
import { persist } from "zustand/middleware";

export type NFCPreferencesStore = {
  preferencesData: SaveNFCPreferences;
  setPreferences: (data: NFCPreferencesStore["preferencesData"]) => void;
};

export const DEFAULT_PREFERENCES: SaveNFCPreferences = {
  showName: true,
  showJobTitle: false,
  showCompanyName: false,
  companyNameOnFront: true,
  showCompanyLogo: false,
  nameOnFront: true,
  jobTitleOnFront: true,
  companyLogoOnFront: true,
  cardImageBack: undefined,
  cardImageFront: undefined,
  cardVariant: "basic",
};

export const nfcPreferencesStore = create(
  persist<NFCPreferencesStore>(
    (set) => ({
      preferencesData: DEFAULT_PREFERENCES,
      setPreferences: (data) => set({ preferencesData: data }),
    }),
    {
      name: "nfc-preferences",
    },
  ),
);
