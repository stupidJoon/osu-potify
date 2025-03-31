import { useCallback, useEffect } from 'react';
import { Beatmapset, useAudioStore } from '@/store/audio/audioStore.ts';
import { toast } from 'sonner';

function setMediaSession(
  beatmapset: Beatmapset,
  play: () => void,
  pause: () => void,
  previousTrack: () => void,
  nextTrack: () => void,
) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: beatmapset.title,
    artist: beatmapset.artist,
    artwork: [
      {
        src: beatmapset.covers['list@2x'],
        type: 'image/jpg',
      },
    ],
  });
  navigator.mediaSession.setActionHandler('play', play);
  navigator.mediaSession.setActionHandler('pause', pause);
  navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
  navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
}

export function useAudioPlaylist() {
  const audio = useAudioStore((state) => state.audio);
  const duration = useAudioStore((state) => state.duration);
  const track = useAudioStore((state) => state.track);
  const beatmapsets = useAudioStore((state) => state.beatmapsets);
  const setIsPlaying = useAudioStore((state) => state.setIsPlaying);
  const setDuration = useAudioStore((state) => state.setDuration);
  const setCurrentTime = useAudioStore((state) => state.setCurrentTime);
  const setTrack = useAudioStore((state) => state.setTrack);

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

  audio.onended = nextTrack;

  audio.onerror = () => {
    console.error('Failed to load audio. Safari may not be supported.');
    toast.error('Failed to load audio. Safari may not be supported.');
  };

  useEffect(() => {
    let isStale = false;

    (async () => {
      audio.pause();

      setDuration(null);
      setCurrentTime(0);

      const beatmapset = beatmapsets[track];
      if (beatmapset === undefined) return;

      setMediaSession(beatmapset, play, pause, previousTrack, nextTrack);

      const api = `${import.meta.env.VITE_AUDIO_API}/${beatmapset.id}/${import.meta.env.VITE_AUDIO_ARG}`;
      const audioBlob = await fetch(api).then((res) => res.blob());
      const audioUrl = URL.createObjectURL(audioBlob);

      if (!isStale) {
        audio.src = audioUrl;
      }
    })();

    return () => {
      isStale = true;
    };
  }, [
    beatmapsets,
    track,
    audio,
    play,
    pause,
    previousTrack,
    nextTrack,
    setCurrentTime,
    setDuration,
  ]);

  return {
    duration,
    track,
    beatmapsets,
    setTrack,
  };
}
