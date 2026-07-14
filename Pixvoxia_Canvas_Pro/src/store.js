import { create } from 'zustand';

export const useStore = create((set) => ({
    activeColor: '#000000',
    activeTool: 'brush',
    viewMode: '2d',
    setViewMode: (mode) => set({ viewMode: mode }),
    isIslandExpanded: false,
    showDashboard: false,
    
    setActiveColor: (color) => set({ activeColor: color }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    toggleIsland: () => set((state) => ({ isIslandExpanded: !state.isIslandExpanded })),
    toggleDashboard: () => set((state) => ({ showDashboard: !state.showDashboard })),
}));
