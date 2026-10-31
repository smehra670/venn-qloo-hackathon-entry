import { create } from "zustand";

interface GuideState {
  tourOpen: boolean;
  helpOpen: boolean;
  startTour: () => void;
  endTour: () => void;
  openHelp: () => void;
  closeHelp: () => void;
}

export const useGuide = create<GuideState>((set) => ({
  tourOpen: false,
  helpOpen: false,
  startTour: () => set({ tourOpen: true, helpOpen: false }),
  endTour: () => set({ tourOpen: false }),
  openHelp: () => set({ helpOpen: true }),
  closeHelp: () => set({ helpOpen: false }),
}));
