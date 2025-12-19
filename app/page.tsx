"use client";

import { JSX, useEffect, useMemo, useState, } from "react";
import Navbar from "../components/navbar";
import Player from "../components/player";
import SongList from "../components/songList";
import PlayerDescription from "../components/playerdescription";
import vodData from "../data/Vod.json";
import { Song, VOD } from "../types/song";
import { useRef } from "react";


/* helpers */
function toSeconds(t: string): number {
  const [m, s] = t.split(":").map(Number);
  return m * 60 + s;
}

function toDateValue(date: string): number {
  return new Date(date).getTime();
}

type SongFilter = "all" | "original" | "cover" | "collab" | "karaoke";
type VodType = "karaoke" | "mv";
const getVodType = (vod: VOD): VodType => (vod.isLivestream ? "karaoke" : "mv");


export default function Home(): JSX.Element {
  const pendingTimestampRef = useRef<string | null>(null);

  const vods = vodData as VOD[];

  /* CURRENT VOD */
  const [currentVodIndex, setCurrentVodIndex] = useState(0);
  const currentVod = vods[currentVodIndex];
  const currentVodType = getVodType(currentVod);


  /**
   * For karaoke: stores the currently selected timestamp (song.start).
   * For MV: null ( do not use timestamps).
   */
  const [currentSongStart, setCurrentSongStart] = useState<string | null>(
    currentVodType === "karaoke" ? currentVod.songs?.[0]?.start ?? null : null
  );

  useEffect(() => {
    if (currentVodType === "karaoke") {
      if (pendingTimestampRef.current) {
        setCurrentSongStart(pendingTimestampRef.current);
        pendingTimestampRef.current = null;
      } else {
        setCurrentSongStart(currentVod.songs?.[0]?.start ?? null);
      }
    } else {
      setCurrentSongStart(null);
    }
  }, [currentVodIndex, currentVodType]);

  /** Derived current karaoke song (for tags + player start) */
  const currentKaraokeSong: Song | null =
    currentVodType === "karaoke" && currentSongStart
      ? currentVod.songs.find((s) => s.start === currentSongStart) ?? null
      : null;

  /* SEARCH & FILTER */
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [songFilter, setSongFilter] = useState<SongFilter>("all");

  type SortOrder = "newest" | "oldest";
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  /* FLATTEN ALL SONGS */
  const allSongs = useMemo(() => {
    return vods.flatMap((vod) =>
      (vod.songs ?? []).map((song) => ({
        ...song,
        videoId: vod.videoId,
        isLivestream: vod.isLivestream,
      }))
    );
  }, [vods]);

  const displayedSongs = useMemo(() => {
    let result = allSongs;

    // tag filter
    if (songFilter !== "all") {
      result = result.filter((song) =>
        song.tags?.some((tag) => tag.toLowerCase() === songFilter)
      );
    }

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((song) => {
        const titleMatch = song.title.toLowerCase().includes(q);

        const artistText = Array.isArray(song.artist)
          ? song.artist.join(" ").toLowerCase()
          : song.artist?.toLowerCase() ?? "";

        const artistMatch = artistText.includes(q);
        const tagMatch = song.tags?.some((tag) =>
          tag.toLowerCase().includes(q)
        );

        const originalArtistText = Array.isArray(song.originalartist)
          ? song.originalartist.join(" ").toLowerCase()
          : song.originalartist?.toLowerCase() ?? "";

        const originalArtistMatch = originalArtistText.includes(q);

        return (
          titleMatch ||
          artistMatch ||
          originalArtistMatch ||
          tagMatch
        );
      });
    }

    // DATE SORT (NEWEST / OLDEST)
    result = [...result].sort((a, b) => {
      const vodA = vods.find((v) => v.videoId === a.videoId);
      const vodB = vods.find((v) => v.videoId === b.videoId);
      if (!vodA || !vodB) return 0;

      const dateA = toDateValue(vodA.date);
      const dateB = toDateValue(vodB.date);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [songFilter, searchQuery, allSongs, sortOrder, vods]);

  /* RANDOM BUTTON */
  function playRandomSong() {
    if (displayedSongs.length === 0) return;

    const random =
      displayedSongs[Math.floor(Math.random() * displayedSongs.length)];

    const vodIndex = vods.findIndex((v) => v.videoId === random.videoId);
    if (vodIndex === -1) return;

    // Karaoke
    if (random.isLivestream) {
      // SAME livestream → jump immediately
      if (vodIndex === currentVodIndex) {
        setCurrentSongStart(random.start);
        return;
      }

      // DIFFERENT livestream → defer timestamp
      pendingTimestampRef.current = random.start;
    } else {
      // MV → clear timestamp
      setCurrentSongStart(null);
    }

    setCurrentVodIndex(vodIndex);
  }


  /* TIMESTAMP CLICK (KARAOKE ONLY) */
  function onTimestampClick(time: string) {
    if (currentVodType !== "karaoke") return;
    setCurrentSongStart(time);
  }

  return (
    <>
      <Navbar />

      <main className="layout">
        {/*  LEFT LAYOUT*/}
        <section className="left">
          <Player
          videoId={currentVod.videoId}
          start={
            currentVodType === "karaoke" && currentSongStart
              ? toSeconds(currentSongStart)
              : 0
          }
        />


          <h2>{currentVod.title}</h2>

          <PlayerDescription
            date={currentVod.date}
            artist={currentVod.artist}
            videoLink={currentVod.videoUrl}
            vodType={currentVodType}
            tags={
              currentVodType === "karaoke"
                ? currentKaraokeSong?.tags ?? []
                : currentVod.songs?.[0]?.tags ?? []
            }
            timestamps={
              currentVodType === "karaoke" && currentVod.songs
                ? currentVod.songs.map((song) => ({
                    time: song.start,
                    title: song.title,
                    originalUrl: song.originalUrl,
                    originalartist: song.originalartist,
                  }))
                : currentVodType === "mv" && currentVod.songs?.[0]?.originalartist
                ? [
                    {
                      time: "00:00",
                      title: currentVod.title,
                      originalartist: currentVod.songs[0].originalartist,
                    },
                  ]
                : []
            }
            onTimestampClick={
              currentVodType === "karaoke" ? onTimestampClick : undefined
            }
          />
        </section>

        {/* RIGHT LAYOUT*/}
        <section className="right">
          {/* FIXED HEADER */}
          <div className="right-header">
            {/* SEARCH */}
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="search for a song / artist / stream / tag"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* RANDOM + FILTER ROW */}
            <div className="control-row">
            {/* FILTER DROPDOWN */}
            <div className="filter-wrapper">
              <button
                className="filter-btn"
                onClick={() => {
                  setFilterOpen((o) => !o);
                  setSortOpen(false);
                }}
              >
                {songFilter === "all"
                  ? "All songs"
                  : songFilter === "original"
                  ? "Original Song"
                  : songFilter === "cover"
                  ? "Cover Song"
                  :songFilter === "karaoke"
                  ? "Karaoke Stream"
                  : "Collab Song"}
                <span className={`arrow ${filterOpen ? "open" : ""}`}>▼</span>
              </button>

              {filterOpen && (
                <div className="filter-menu">
                  <div
                    onClick={() => {
                      setSongFilter("all");
                      setFilterOpen(false);
                    }}
                  >
                    All Songs
                  </div>
                  <div
                    onClick={() => {
                      setSongFilter("original");
                      setFilterOpen(false);
                    }}
                  >
                    Original Song
                  </div>
                  <div
                    onClick={() => {
                      setSongFilter("cover");
                      setFilterOpen(false);
                    }}
                  >
                    Cover Song
                  </div>
                  <div
                    onClick={() => {
                      setSongFilter("collab");
                      setFilterOpen(false);
                    }}
                  >
                    Collab Song
                  </div>
                  <div
                    onClick={() => {
                      setSongFilter("karaoke");
                      setFilterOpen(false);
                    }}
                  >
                    Karaoke Stream
                  </div>
                </div>
              )}
            </div>

            {/* SORT DROPDOWN (NEWEST / OLDEST) */}
            <div className="filter-wrapper">
              <button
                className="filter-btn"
                onClick={() => {
                  setSortOpen((o) => !o);
                  setFilterOpen(false);
                }}
              >
                {sortOrder === "newest" ? "Newest" : "Oldest"}
                <span className={`arrow ${sortOpen ? "open" : ""}`}>▼</span>
              </button>

              {sortOpen && (
                <div className="filter-menu">
                  <div
                    onClick={() => {
                      setSortOrder("newest");
                      setSortOpen(false);
                    }}
                  >
                    Newest
                  </div>
                  <div
                    onClick={() => {
                      setSortOrder("oldest");
                      setSortOpen(false);
                    }}
                  >
                    Oldest
                  </div>
                </div>
              )}
            </div>

            {/* RANDOM */}
            <button className="random-btn" onClick={playRandomSong}>
              ✖ Play a random song
            </button>
          </div>
          </div>

          {/* SCROLLABLE LIST */}
          <div className="right-content">
            <SongList
              songs={displayedSongs}
              vods={vods}
              currentVodVideoId={currentVod.videoId}
              currentVodType={currentVodType}
              currentSongStart={currentSongStart}
              onSelectSong={(song) => {
              const vodIndex = vods.findIndex((v) => v.videoId === song.videoId);
              if (vodIndex === -1) return;

              // karaoke
              if (song.isLivestream) {
                // SAME livestream → change timestamp immediately
                if (vodIndex === currentVodIndex) {
                  setCurrentSongStart(song.start);
                  return;
                }

                // DIFFERENT livestream → defer timestamp
                pendingTimestampRef.current = song.start;
              }

              setCurrentVodIndex(vodIndex);
            }}
            />
          </div>
        </section>
      </main>

      <style jsx>{`
        .layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 32px;
        }

        .left {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .right {
          padding: 16px 16px 16px 24px;
          border-left: 2px solid rgba(0, 0, 0, 0.08);
          max-height: calc(100vh - 72px);
          display: flex;
          flex-direction: column;
        }

        .right-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 12px;
        }

        .right-content {
          flex: 1;
          overflow-y: auto;
        }

        .search-box {
          display: flex;
          gap: 8px;
          background: white;
          padding: 10px 14px;
          border-radius: 999px;
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
        }

        .control-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .random-btn {
          flex: 1;
          background: #ffd966;
          border: none;
          border-radius: 999px;
          padding: 12px 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .random-btn:hover {
          background: #c9d5e693;
        }

        .filter-wrapper {
          position: relative;
        }

        .filter-btn {
          background: #eaf4ff;
          border-radius: 16px;
          padding: 10px 16px;
          border: none;
          font-weight: 600;
          display: flex;
          gap: 8px;
          align-items: center;
          cursor: pointer;
        }

        .filter-btn:hover {
          background: #76b0fd;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .filter-menu {
          position: absolute;
          top: 110%;
          left: 0;
          background: #ffd86b;
          border-radius: 16px;
          padding: 10px;
          width: 180px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 20;
        }

        .filter-menu div {
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
        }

        .filter-menu div:hover {
          background: rgba(255, 255, 255, 0.4);
        }

      @media (max-width: 768px) {
        .layout {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .left {
          padding: 12px;
        }

        .right {
          padding: 12px;
          border-left: none;
          max-height: none;
          display: flex;
          flex-direction: column;
        }

        .right-content {
          flex: 1;
          max-height: 55vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .right-header {
          flex-shrink: 0;
        }

        .control-row {
          flex-direction: column;
          align-items: stretch;
        }

        .filter-btn,
        .random-btn {
          width: 100%;
        }
      }
      `}</style>
    </>
  );
}