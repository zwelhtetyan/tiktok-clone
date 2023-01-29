import { create } from 'zustand';

interface ThemeState {
  theme: string;
  setTheme(theme: string): void;
}

const useThemeStore = create<ThemeState>()((set) => ({
  theme: '',
  setTheme: (theme) => set(() => ({ theme })),
}));

export default useThemeStore;
