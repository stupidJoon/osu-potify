import { useCallback, useEffect } from 'react';
import { useAudioStore } from '@/store/audio/audioStore.ts';
import { useAudioVolumeStore } from '@/store/audio/audioVolumeStore.ts';

export function useAudioController() {
  const audio = useAudioStore((state) => state.audio);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const duration = useAudioStore((state) => state.duration);
  const currentTime = useAudioStore((state) => state.currentTime);
  const track = useAudioStore((state) => state.track);
  const beatmapsets = useAudioStore((state) => state.beatmapsets);
  const setIsPlaying = useAudioStore((state) => state.setIsPlaying);
  const setDuration = useAudioStore((state) => state.setDuration);
  const setCurrentTime = useAudioStore((state) => state.setCurrentTime);
  const setTrack = useAudioStore((state) => state.setTrack);

  const volume = useAudioVolumeStore((state) => state.volume);
  const muted = useAudioVolumeStore((state) => state.muted);
  const setVolume = useAudioVolumeStore((state) => state.setVolume);
  const setMuted = useAudioVolumeStore((state) => state.setMuted);

  const play = useCallback(() => setIsPlaying(true), [setIsPlaying]);
  const pause = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  const previousTrack = useCallback(() => {
    if (track < 1) {
      setIsPlaying(false);
      return;
    }
    setTrack(track - 1);
  }, [track, setTrack, setIsPlaying]);

  const nextTrack = useCallback(() => {
    if (track >= beatmapsets.length - 1) {
      setIsPlaying(false);
      return;
    }
    setTrack(track + 1);
  }, [beatmapsets, track, setTrack, setIsPlaying]);

  audio.onloadedmetadata = () => {
    setDuration(audio.duration);
  };

  audio.ontimeupdate = () => {
    if (duration === null) return; // audio loading
    setCurrentTime(audio.currentTime);
  };

  useEffect(() => {
    if (duration === null) return; // audio loading
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, duration, audio, setIsPlaying]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio, setMuted]);

  useEffect(() => {
    audio.muted = muted;
  }, [muted, audio]);

  return {
    audio,
    isPlaying,
    duration,
    currentTime,
    volume,
    muted,
    setVolume,
    setMuted,
    play,
    pause,
    previousTrack,
    nextTrack,
  };
}
