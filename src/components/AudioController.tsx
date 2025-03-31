import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { formatTime } from '@/lib/utils.ts';
import { useAudioController } from '@/store/audio/useAudioController.ts';

export function AudioController() {
  const {
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
  } = useAudioController();

  const onTimeChange = (value: number[]) => {
    audio.currentTime = value[0];
  };
  const onVolumeChange = (value: number[]) => {
    setMuted(false);
    setVolume(value[0]);
  };
  const onMuteToggle = () => {
    setMuted(!muted);
  }

  return (
    <Card className='sticky bottom-0 p-8 rounded-b-none'>
      <div className='flex gap-4 justify-center'>
        <Button onClick={previousTrack} variant='secondary' size='icon'>
          <SkipBack />
        </Button>
        {isPlaying ? (
          <Button onClick={pause} size='icon'>
            <Pause />
          </Button>
        ) : (
          <Button onClick={play} size='icon'>
            <Play />
          </Button>
        )}
        <Button onClick={nextTrack} variant='secondary' size='icon'>
          <SkipForward />
        </Button>
        <Button onClick={onMuteToggle} variant='secondary' size='icon'>
          {(muted) ? (
            <VolumeX />
          ) : (
            <Volume2 />
          )}
        </Button>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={onVolumeChange}
        />
      </div>
      <div className='flex gap-4'>
        <Slider
          min={0}
          max={duration ?? 1}
          step={0.01}
          value={duration === null ? [0] : [currentTime]}
          onValueChange={onTimeChange}
        />
        <p className='text-sm text-muted-foreground text-nowrap'>
          {formatTime(currentTime)} / {formatTime(duration ?? 0)}
        </p>
      </div>
    </Card>
  );
}
