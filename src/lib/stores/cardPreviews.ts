import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ContactVCardType } from "~/server/db/schema";

type CardPreviewsStore = {
  previewsData?: ContactVCardType;
  setPreview: (data: ContactVCardType) => void;
};

export const cardPreviewsStore = create(
  persist<CardPreviewsStore>(
    (set) => ({
      previewsData: undefined,
      setPreview: (data) => set({ previewsData: data }),
    }),
    {
      name: "card-previews-store",
    },
  ),
);
