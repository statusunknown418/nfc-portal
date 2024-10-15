import { create } from "zustand";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";
import { persist } from "zustand/middleware";

export type NFCPreferencesStore = {
  preferencesData: SaveNFCPreferences;
  setPreferences: (data: NFCPreferencesStore["preferencesData"]) => void;
};

export const DEFAULT_PREFERENCES: SaveNFCPreferences = {
  showName: true,
  showJobTitle: true,
  showCompanyName: true,
  showCompanyLogo: true,
  includeQRCode: true,
  cardImageBack: undefined,
  cardImageFront: undefined,
  cardVariant: "basic",
  cardTemplate: undefined,
  cardColorFront: undefined,
  cardColorBack: undefined,
  profileImageUrl: undefined,
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
