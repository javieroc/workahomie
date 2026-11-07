import { create } from 'zustand';

/**
 * Ephemeral UI state shared between the list and the map.
 * Filters live in the URL (shareable links); only interaction state lives here.
 */
interface ExploreState {
  hoveredId: string | null;
  selectedId: string | null;
  mobileView: 'list' | 'map';
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  setMobileView: (v: 'list' | 'map') => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  hoveredId: null,
  selectedId: null,
  mobileView: 'list',
  setHovered: (hoveredId) => set({ hoveredId }),
  setSelected: (selectedId) => set({ selectedId }),
  setMobileView: (mobileView) => set({ mobileView }),
}));
