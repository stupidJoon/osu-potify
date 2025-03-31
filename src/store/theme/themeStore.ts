import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const storageKey = 'vite-ui-theme';
const initialTheme = 'system';

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        theme: initialTheme,
        setTheme: (theme: Theme) => set({ theme }),
      }),
      { name: storageKey },
    ),
  ),
);
