import { create } from "zustand";
import { type ContactVCardType } from "~/server/db/schema";

type CardPreviewsStore = {
  previewsData?: ContactVCardType;
  setPreview: (data: ContactVCardType) => void;
};

export const cardPreviewsStore = create<CardPreviewsStore>((set) => ({
  previewsData: undefined,
  setPreview: (data) => set({ previewsData: data }),
}));
