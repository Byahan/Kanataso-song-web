import { JSX, useState } from "react";

const ARTIST_COLOR_MAP: Record<string, string> = {
  "minato aqua": "aqua",
  "amane kanata": "kanata",
  "amane konata": "konata",
  "ayunda risu": "ayunda",
  "azki":"azki",
  "sakamata chloe":"chloe",
  "sorahoshi kirame":"kirame",
  "yukihana lamy": "lamy",
  "nakiri ayame": "ayame",
  "hoshimachi suisei": "suisei",
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
  "koganei niko": "niko",
  "mori calliope": "mori",
  "elizabeth rose bloodflame": "rose",
  "momosuzu nene": "nene",
  "laplus darkness": "laplus",
  "aki rosenthal": "aki",
  "yozora mel": "mel",
  "oozora subaru": "subaru",
  "uruha rushia": "rushia",
  "nekomata okayu": "okayu",
  "tokoyami towa": "towa",
  "tsunomaki watame": "watame",
  "kiryu coco": "coco",
  "shiranui flare": "flare",
  "tokino sora": "sora"
};

function getArtistClass(name: string): string {
  const key = name.toLowerCase().trim();
  return ARTIST_COLOR_MAP[key] ?? "";
}

const TAG_COLOR_MAP: Record<string, { bg: string; color: string }> = {
  trigger: { bg: "#1d45e7ff", color: "#ffffff" },
  original: { bg: "#c7d2fe", color: "#1e3a8a" },
  cover: { bg: "#fbcfe8", color: "#831843" },
  collab: { bg: "#bbf7d0", color: "#065f46" },
  "unknown diva": { bg: "#9437fdff", color: "#ffffffff" },
  mv: { bg: "#b34dbeff", color: "#cffff1ff" },
  "3d": { bg: "#d8637cff", color: "#cffff1ff" },
  shorts: { bg: "#fde68a", color: "#92400e" },
};

function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
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


interface Timestamp {
  time: string;
  title: string;
  originalUrl?: string;
}

type VodType = "karaoke" | "mv";

interface DescriptionProps {
  date: string;
  artist: string;
  videoLink: string;
  tags: string[];
  timestamps: {
    time: string;
    title: string;
    originalUrl?: string;
    originalartist?: string | string[];
  }[];
  vodType: VodType;

  onTimestampClick?: (time: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function PlayerDescription({
  date,
  artist,
  videoLink,
  tags,
  timestamps,
  vodType,
  onTimestampClick,
  onTagClick,
}: DescriptionProps): JSX.Element {

    const [showAllTimestamps, setShowAllTimestamps] = useState(false);
    const INITIAL_TIMESTAMP_COUNT = 2;

    const visibleTimestamps = showAllTimestamps
      ? timestamps
      : timestamps.slice(0, INITIAL_TIMESTAMP_COUNT);

  return (
    <div className="card">
      <div className="grid">
        <div className="label">Date uploaded</div>
        <div className="value">
          <span className="pill">{date}</span>
        </div>

        {vodType === "mv" && (
          <>
            {/* VOCAL */}
            <div className="label">Vocal</div>
            <div className="value">
              <div className="pillGroup">
                {Array.isArray(artist) ? (
                  artist.map((name, i) => (
                    <span key={i}>
                      <span className={`pill ${getArtistClass(name)}`}>{name}</span>
                      {i < artist.length - 1 && (
                        <span className="collabSymbol">×</span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className={`pill ${getArtistClass(artist)}`}>{artist}</span>
                )}
              </div>
            </div>

            {/* ORIGINAL ARTIST */}
            {timestamps[0]?.originalartist && (
              <>
                <div className="label">Original Artist</div>
                <div className="value">
                  {Array.isArray(timestamps[0].originalartist) ? (
                    timestamps[0].originalartist.map((name: string, i: number) => (
                      <span key={i}>
                        <span className="pill">{name}</span>
                        {Array.isArray(timestamps[0]?.originalartist) &&
                        i < timestamps[0].originalartist.length - 1 && (
                          <span className="collabSymbol"> × </span>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="pill">
                      {timestamps[0].originalartist}
                    </span>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className="label">Stream Link</div>
        <div className="value">
          <a href={videoLink} target="_blank" rel="noreferrer" className="link">
            ▶ Open on YouTube
          </a>
        </div>

        <div className="label">Tag</div>
        <div className="value">
          <div className="tags">
            {(tags ?? []).length === 0 ? (
              <span className="muted">—</span>
            ) : (
              (tags ?? []).map((tag) => {
              const style = getTagStyle(tag);

              return (
                <span
                  key={tag}
                  className={`tag ${onTagClick ? "clickable" : ""}`}
                  style={{
                    background: style.bg,
                    color: style.color,
                  }}
                  onClick={() => onTagClick?.(tag)}
                  role={onTagClick ? "button" : undefined}
                  tabIndex={onTagClick ? 0 : undefined}
                >
                  #{tag}
                </span>
              );
            })
            )}
          </div>
        </div>

        {vodType === "karaoke" && (
          <>
            <div className="label">Timestamp</div>
            <div className="value">
              {timestamps.length === 0 ? (
                <span className="muted">—</span>
              ) : (
                <>
                  <ul className="timestamps">
                    {visibleTimestamps.map((t) => (
                      <li key={`${t.time}-${t.title}`} className="timestampRow">
                        <button
                          type="button"
                          className="timestampTime"
                          onClick={() => onTimestampClick?.(t.time)}
                          title="Jump to timestamp"
                        >
                          {t.time}
                        </button>

                        <div className="timestampText">
                          <span className="song">{t.title}</span>

                          {t.originalUrl && (
                            <a
                              href={t.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ytBtn"
                              title="Open original video"
                            >
                              ▶
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {timestamps.length > INITIAL_TIMESTAMP_COUNT && (
                    <button
                      type="button"
                      className="seeMoreBtn"
                      onClick={() => setShowAllTimestamps((v) => !v)}
                    >
                      {showAllTimestamps ? "See less ▲" : "See more ▼"}
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .card {
          background: #def4ffe5;
          border-radius: 16px;
          padding: 18px 18px 22px;
          width: 100%;
          box-sizing: border-box;
        }

        .grid {
          display: grid;
          grid-template-columns: 140px 1fr;
          row-gap: 12px;
          column-gap: 14px;
          align-items: start;
        }

        .label {
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
        }

        .value {
          min-width: 0;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          background: #67e8f9;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
        }

        .pill.aqua {
          background: #de7dfcff;
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

        .pill.konata {
          background: #8c3ce9ff;
          color: #c7d2fe;
        }

        .pill.niko {
          background: #FACC15;
          color: #78350F;
        }
        .pill.mori {
          background: #EC4899;
          color: #FFF1F2;
        }
        .pill.rose {
          background: #991B1B;
          color: #FEE2E2;
        }

        .pill.nene {
          background: #e9d415ff;
          color: #616d56ff;
        }

        .pill.aki {
          background: #F472B6;
          color: #4A044E;
        }

        .pill.mel {
          background: #FDE047;
          color: #713F12;
        }

        .pill.subaru {
          background: #38BDF8;
          color: #082F49;
        }

        .pill.okayu {
          background: #A78BFA;
          color: #2E1065;
        }

        .pill.towa {
          background: #6D28D9;
          color: #F5F3FF;
        }

        .pill.watame {
          background: #FEF3C7;
          color: #92400E;
        }

        .pill.coco {
          background: #EA580C;
          color: #FFF7ED;
        }

        .pill.flare {
          background: #F59E0B;
          color: #451A03;
        }

        .pill.sora {
          background: #7DD3FC;
          color: #0C4A6E;
        }
          
        .link {
          color: #0284c7;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .link:hover {
          text-decoration: underline;
        }

        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .titleLine {
        display: inline-flex;
        align-items: center;
        gap: 6px;

        min-width: 0;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          background: #67e8f9;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          user-select: none;
        }

        .tag.clickable {
          cursor: pointer;
        }

        .timestamps {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .time {
          color: #0284c7;
          font-weight: 600;
          white-space: nowrap;
        }

        .song {
          color: #0f172a;
          line-height: 1.4;
          white-space: normal;
          word-break: normal;
          overflow-wrap: break-word;
        }

        .muted {
          color: #64748b;
          font-weight: 600;
        }

        @media (max-width: 720px) {
          .grid {
            grid-template-columns: 120px 1fr;
          }
        }

        .timestampRow {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 10px;
          align-items: start;
          margin-bottom: 6px;
        }

        .timestampText {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-width: 0;
        }

        .timestampMain {
          display: grid;
          grid-template-columns: 56px minmax(0, 1fr);
          gap: 10px;

          width: 100%;
          min-width: 0;

          background: none;
          border: none;
          padding: 4px 6px;
          cursor: pointer;
          text-align: left;
        }
        
        .timestampTime {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: #0284c7;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
        }

        .timestampTime:hover {
          text-decoration: underline;
        }

        .ytBtn {
          font-size: 20px;
          color: #FFC000;
          text-decoration: none;
          flex-shrink: 0;
        }

        .timestampContent {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .ytBtn:hover {
          opacity: 1;
        } 

        .collabSymbol {
          margin: 0 2px;
          font-weight: 700;
          opacity: 0.6;
        }

        .pillGroup {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px 8px;
        }

        .seeMoreBtn {
        margin-top: 6px;
        background: none;
        border: none;
        color: #0284c7;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
      }

      .seeMoreBtn:hover {
        text-decoration: underline;
      }

      @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .label {
        font-size: 13px;
      }

      .value {
        margin-bottom: 8px;
      }
    }

      `}</style>
    </div>
  );
}
