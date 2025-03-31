import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface AudioVolumeStore {
  volume: number;
  muted: boolean;
  setVolume(v: number): void;
  increaseVolume: (step: number) => void;
  decreaseVolume: (step: number) => void;
  setMuted: (muted: boolean) => void;
}

const storageKey = 'volume';
const initialVolume = 0.5;
const initialMuted = false;

export const useAudioVolumeStore = create<AudioVolumeStore>()(
  devtools(
    persist(
      (set, get) => ({
        volume: initialVolume,
        muted: initialMuted,
        setVolume: (v) => set({ volume: v }),
        increaseVolume: (step) => {
          const { volume } = get();
          set({ volume: Math.min(volume + step, 1) });
        },
        decreaseVolume: (step) => {
          const { volume } = get();
          set({ volume: Math.max(volume - step, 0) });
        },
        setMuted: (muted) => set({ muted }),
      }),
      { name: storageKey },
    ),
  ),
);
