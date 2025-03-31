import { LoaderCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn, formatTime } from '@/lib/utils.ts';
import { useAudioPlaylist } from '@/store/audio/useAudioPlaylist.ts';

export function BeatmapsetTable() {
  const { duration, track, beatmapsets, setTrack } = useAudioPlaylist();

  return (
    <Table className='flex-1 table-fixed'>
      <TableBody>
        {beatmapsets.map((beatmapset, index) => (
          <TableRow
            key={beatmapset.id}
            onClick={() => setTrack(index)}
            className={cn(index === track && 'bg-muted/50', 'cursor-default')}>
            <TableCell className='w-16 p-1'>
              <div
                style={{
                  backgroundImage: `url(${beatmapset.covers['list@2x']})`,
                }}
                className='size-full aspect-square bg-cover'>
                {index === track && duration === null && (
                  <div className='size-full flex justify-center items-center bg-card/80'>
                    <LoaderCircle className='animate-spin' />
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className=''>
              <h2 className='overflow-hidden overflow-ellipsis'>
                {beatmapset.title}
              </h2>
              <p className='text-muted-foreground text-xs overflow-hidden overflow-ellipsis'>
                {beatmapset.artist}
                {' · '}
                {formatTime(beatmapset.beatmaps[0].total_length)}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
