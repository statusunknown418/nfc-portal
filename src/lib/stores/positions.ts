import { create } from "zustand";

type PositionsStore = {
  positions: Record<string, number>;
  setPosition: (id: number, position: number) => void;
  getPosition: (id: number) => number;
};
export const positionsStore = create<PositionsStore>((set, get) => ({
  positions: {},
  setPosition: (id, position) =>
    set((state) => ({ positions: { ...state.positions, [id]: position } })),
  getPosition: (id) => get().positions[id] ?? 0,
}));
