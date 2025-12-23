import { Song } from "../types/song";
import Image from "next/image";

/* Artist color tag */
const ARTIST_COLOR_MAP: Record<string, string> = {
  "minato aqua": "aqua",
  "amane kanata": "kanata",
  "ayunda risu": "ayunda",
  "azki":"azki",
  "sakamata chloe":"chloe",
  "sorahoshi kirame":"kirame",
  "yukihana lamy": "lamy",
  "nakiri ayame": "ayame",
  "Hoshimachi Suisei": "suisei",
  "ookami mio": "mio",
  "omaru polka": "polka",
  "laplus darknesss": "laplus",
  "juufuutei raden": "raden",
  "usada pekora": "pekora",
  "houshou marine": "marine",
  "amamiya kokoro": "kokoro",
  "himemori luna": "luna",
  "shishidou akari": "akari",
  "murasaki shion": "shion",
  "sakura miko": "miko",
};

const TAG_COLOR_MAP: Record<string, { bg: string; color: string }> = {
  trigger: { bg: "#1d45e7ff", color: "#ffffff" },
  original: { bg: "#c7d2fe", color: "#1e3a8a" },
  cover: { bg: "#fbcfe8", color: "#831843" },
  collab: { bg: "#bbf7d0", color: "#065f46" },
  mv: { bg: "#b34dbeff", color: "#cffff1ff" },
  "holo*27": { bg: "#4ce659ff", color: "#cffff1ff" },
  "unknown diva": { bg: "#9437fdff", color: "#ffffffff" },
  "3d": { bg: "#d8637cff", color: "#cffff1ff" },
  shorts: { bg: "#fde68a", color: "#92400e" },
  
};

function getArtistClass(name: string): string {
  return ARTIST_COLOR_MAP[name.toLowerCase().trim()] ?? "";
}

function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9 *]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getTagStyle(tag: string) {
  const key = normalizeTag(tag);

  return TAG_COLOR_MAP[key] ?? {
    bg: "#67e8f9",
    color: "#0f172a",
  };
}

type VodType = "karaoke" | "mv";

interface SongCardProps {
  song: Song;
  videoId: string;
  active: boolean;
  vodType: VodType;
  showTimestamp: boolean;
  vodDate?: string;
  onClick: () => void;
}

export default function SongCard({
  song,
  videoId,
  active,
  vodType,
  showTimestamp,
  vodDate,
  onClick,
}: SongCardProps) {
  const activeClass = active
    ? vodType === "karaoke"
      ? "active-karaoke"
      : "active-mv"
    : "";

  return (
    <button
      className={`songCard ${activeClass}`}
      onClick={onClick}
      type="button"
    >
      {/* THUMB */}
      <div className="thumb">
        <Image
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={song.title}
          fill
          sizes="52px"
          className="thumbImg"
        />
      </div>

      {/* INFO */}
      <div className="info">
        <div className="title">{song.title}</div>

        {/* ARTIST (string | string[]) */}
        {/* ARTIST */}
        <div className="artist">
          {/* ORIGINAL ARTIST (MV ONLY) */}
          {vodType === "mv" && song.originalartist && (
            <>
              {Array.isArray(song.originalartist) ? (
                song.originalartist.map((name: string, i: number) => (
                  <span key={`orig-${i}`}>
                    <span className="pill">{name}</span>
                    {Array.isArray(song.originalartist) &&
                    i < song.originalartist.length - 1 && (
                      <span className="collabSymbol"> x </span>
                    )}
                  </span>
                ))
              ) : (
                <span className="pill">{song.originalartist}</span>
              )}
              <span className="collabSymbol"> • </span>
            </>
          )}

          {/* VOCAL */}
          {Array.isArray(song.artist) ? (
            song.artist.map((name, i) => (
              <span key={`${name}-${i}`}>
                <span className={`pill ${getArtistClass(name)}`}>{name}</span>
                {i < song.artist.length - 1 && (
                  <span className="collabSymbol"> × </span>
                )}
              </span>
            ))
          ) : (
            <span className={`pill ${getArtistClass(song.artist)}`}>
              {song.artist}
            </span>
          )}
        </div>

        {/* DATE (from VOD) */}
        {showTimestamp && vodDate && (
          <div className="time">
            {new Date(vodDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        )}

        <div className="tags">
          {song.tags?.map((tag) => {
            const style = getTagStyle(tag);

            return (
              <span
                key={tag}
                className="tag"
                style={{
                  background: style.bg,
                  color: style.color,
                }}
              >
                #{tag}
              </span>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .songCard {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 14px;
          background: #e8f4ff;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 160ms ease;
        }

        .songCard:not(.active-karaoke):not(.active-mv):hover {
          background: #7ea3d3ff;
        }

        .songCard.active-karaoke {
          background: linear-gradient(45deg, #e4f4ff 37%, #ffd966 100%);
        }

        .songCard.active-mv {
          background: linear-gradient(45deg, #e4f4ff 37%, #99a7dfff 100%);
        }

        .thumb {
          width: 89px;
          height: 69px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          background: #e5e7eb;
          flex: 0 0 auto;
        }

        .thumbImg {
          object-fit: cover;
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .title {
          font-weight: 700;
          color: #1e40af;
        }

        .artist {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px 8px;
          font-size: 13px;
          color: #2563eb;
        }

        .time {
          font-size: 12px;
          color: #0284c7;
          margin-top: 4px;
        }

        .tags {
          display: flex;
          gap: 6px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 11px;
          padding: 2px 8px;
          background: #67e8f9;
          border-radius: 999px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: #67e8f9;
          color: #0f172a;
        }

        .pill.aqua {
          background: #e7adf8ff;
          color: #003049;
        }

        .pill.kanata {
          background: #c7d2fe;
          color: #1e3a8a;
        }

        .pill.ayunda {
          background: #ffdc6aff;
          color: #2e3033ff;
        }

        .pill.azki {
          background: #ff2c6fff;
          color: #f7d1f2ff;
        }

        .pill.chloe {
          background: #0a0808ff;
          color: #f71143ff;
        }

        .pill.kirame {
          background: #818cf8;
          color: #ffffff;
        }

        .pill.lamy {
          background: #60A5FA;
          color: #D7EAF8;
        }

        .pill.ayame {
          background: #f74949ff;
          color: #ffffff;
        }

        .pill.suisei {
          background: #2563EB;
          color: #F8FAFC;
        }

        .pill.mio {
          background: #2F855A; 
          color: #ECFDF5; 
        }
          
        .pill.polka {
          background: #F59E0B;
          color: #1F2933; 
        }

        .pill.laplus {
          background: #4C1D95;
          color: #F5F3FF;
        }

        .pill.raden {
          background: #7C2D12;
          color: #FEF3C7;
        }

        .pill.pekora {
          background: #FB923C;
          color: #1F2937;
        }
          
        .pill.marine {
          background: #9F1239; 
          color: #FFF1F2; 
        }

        .pill.kokoro {
          background: #93C5FD;
          color: #F8FAFC; 
        }

        .pill.luna {
          background: #F9A8D4;
          color: #701A75; 
        }

        .pill.akari {
          background: #FBBF24;
          color: #78350F;
        }
      
        .pill.shion {
          background: #8B5CF6;
          color: #F5F3FF;
        }

        .pill.miko {
          background: #FB7185;
          color: #FFF1F2;
        }

        .collabSymbol {
          font-weight: 800;
          color: #2563eb;
          margin: 0 2px;
        }

        @media (max-width: 768px) {
        .songCard {
          padding: 10px;
        }

        .thumb {
          width: 72px;
          height: 54px;
        }

        .title {
          font-size: 14px;
        }

        .artist {
          font-size: 12px;
        }
      }
      `}</style>
    </button>
  );
}
