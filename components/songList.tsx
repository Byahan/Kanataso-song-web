import SongCard from "./songCard";
import { Song } from "../types/song";

type VodType = "karaoke" | "mv";

interface SongWithVideo extends Song {
  videoId: string;
  isLivestream: boolean;
}

interface SongListProps {
  songs: SongWithVideo[];
  vods: { videoId: string; date: string }[];

  currentVodVideoId: string;
  currentVodType: VodType;
  currentSongStart: string | null;

  onSelectSong?: (song: SongWithVideo) => void;
}

export default function SongList({
  songs,
  vods,
  currentVodVideoId,
  currentVodType,
  currentSongStart,
  onSelectSong,
}: SongListProps) {
  return (
    <div className="list">
      {songs.map((song) => {
        const songType: VodType = song.isLivestream ? "karaoke" : "mv";

        const isInCurrentVod = song.videoId === currentVodVideoId;

        const active =
          songType === "karaoke"
            ? isInCurrentVod && currentSongStart === song.start
            : isInCurrentVod; // MV: active depends only on current VOD

      const vod = vods.find((v) => v.videoId === song.videoId);

      return (
        <SongCard
          key={`${song.videoId}-${song.start}-${song.title}`}
          song={song}
          videoId={song.videoId}
          vodType={songType}
          showTimestamp={true}
          vodDate={vod?.date}
          active={active}
          onClick={() => onSelectSong?.(song)}
        />
      );
      })}

      <style jsx>{`
        .list {
          display: grid;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
