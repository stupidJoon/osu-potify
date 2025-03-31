import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle.tsx';
import { useAudioStore } from '@/store/audio/audioStore.ts';
import { useKbdAudioControl } from '@/store/audio/useKbdAudioControl.ts';
import { BeatmapsetTable } from '@/components/BeatmapsetTable.tsx';
import { AudioController } from '@/components/AudioController.tsx';

async function getBeatmapsets() {
  const api = import.meta.env.VITE_SEARCH_API;
  const res = await fetch(api);
  const json = await res.json();
  return json;
}

export default function App() {
  const setBeatmapsets = useAudioStore((state) => state.setBeatmapsets);
  useKbdAudioControl();

  useEffect(() => {
    getBeatmapsets().then((beatmapsets) => setBeatmapsets(beatmapsets));
  }, [setBeatmapsets]);

  return (
    <div className='max-w-3xl min-h-svh mx-auto px-4 flex flex-col gap-4'>
      <div className='sticky top-0 py-4 z-10 bg-background flex justify-between'>
        <h1 className='text-2xl font-bold'>osu-potify</h1>
        <div className='flex gap-4'>
          <ThemeToggle />
        </div>
      </div>
      <BeatmapsetTable />
      <AudioController />
    </div>
  );
}
