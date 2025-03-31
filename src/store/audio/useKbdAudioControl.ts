import { useEffect } from 'react';
import { useAudioStore } from '@/store/audio/audioStore.ts';
import { useAudioVolumeStore } from '@/store/audio/audioVolumeStore.ts';

export function useKbdAudioControl() {
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const setIsPlaying = useAudioStore((state) => state.setIsPlaying);
  const seekForward = useAudioStore((state) => state.seekForward);
  const seekBackward = useAudioStore((state) => state.seekBackward);

  const increaseVolume = useAudioVolumeStore((state) => state.increaseVolume);
  const decreaseVolume = useAudioVolumeStore((state) => state.decreaseVolume);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) return;

      if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) setIsPlaying(false);
        else setIsPlaying(true);
      } else if (e.key === 'ArrowLeft') {
        seekBackward(5);
      } else if (e.key === 'ArrowRight') {
        seekForward(5);
      } else if (e.key === 'ArrowUp') {
        increaseVolume(0.01);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        decreaseVolume(0.01);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isPlaying,
    setIsPlaying,
    seekForward,
    seekBackward,
    increaseVolume,
    decreaseVolume,
  ]);
}
