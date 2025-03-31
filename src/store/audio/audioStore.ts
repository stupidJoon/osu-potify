import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Beatmap {
  id: number;
  total_length: number;
}
export interface Beatmapset {
  id: number;
  title: string;
  artist: string;
  preview_url: string;
  beatmaps: Beatmap[];
  covers: {
    'list@2x': string;
    'card@2x': string;
  };
}

interface AudioStore {
  audio: HTMLAudioElement;
  isPlaying: boolean;
  duration: number | null; // duration이 null이면 오디오 로딩중
  currentTime: number;
  track: number;
  beatmapsets: Beatmapset[];

  setIsPlaying(v: boolean): void;
  setDuration(v: number | null): void;
  setCurrentTime(v: number): void;
  setTrack(v: number): void;
  setBeatmapsets(v: Beatmapset[]): void;

  seekForward: (seconds: number) => void;
  seekBackward: (seconds: number) => void;
}

export const useAudioStore = create<AudioStore>()(
  devtools((set, get) => ({
    audio: new Audio(),
    isPlaying: false,
    duration: null,
    currentTime: 0,
    track: 0,
    beatmapsets: [],

    setIsPlaying: (v) => set({ isPlaying: v }),
    setDuration: (v) => set({ duration: v }),
    setCurrentTime: (v) => {
      set({ currentTime: v });
    },
    setTrack: (v) => set({ track: v }),
    setBeatmapsets: (v) => set({ beatmapsets: v }),

    seekForward: (seconds) => {
      const { audio, currentTime, duration } = get();
      audio.currentTime = Math.min(currentTime + seconds, duration ?? 0);
    },
    seekBackward: (seconds) => {
      const { audio, currentTime } = get();
      audio.currentTime = Math.max(currentTime - seconds, 0);
    },
  })),
);
