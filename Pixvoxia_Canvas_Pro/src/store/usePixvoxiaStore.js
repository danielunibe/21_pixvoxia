import { create } from 'zustand'

export const usePixvoxiaStore = create((set) => ({
  selectedTool: 'brush',
  selectedColor: '#ff2d55',
  brushSize: 32,
  mode: '2d',
  setTool: (tool) => set({ selectedTool: tool }),
  setColor: (color) => set({ selectedColor: color }),
  setMode: (mode) => set({ mode }),
  setBrushSize: (size) => set({ brushSize: size }),
}))
