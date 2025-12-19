export type NameField = string | string[];

export interface Song {
  title: string;
  artist: string | string[];
  originalartist?: string | string[];
  start: string; // used for karaoke timestamps; MV can keep "00:00" but will be hidden in UI
  originalUrl?: string;
  tags?: string[];
}

export type VodType = "karaoke" | "mv";

export interface VOD {
  /** true = karaoke livestream, false = MV / normal youtube video */
  isLivestream: boolean;

  /** derived type if you want it, but not required in your JSON */
  type?: VodType;
  videoUrl: string;
  artist: string;
  videoId: string;
  date: string;
  title: string;
  songs: Song[];
}
