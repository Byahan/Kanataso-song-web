import { JSX, useState } from "react";

const ARTIST_COLOR_MAP: Record<string, string> = {
  "minato aqua": "aqua",
  "amane kanata": "kanata",
  // add more later
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
  "unknown diva": { bg: "#f59e0b", color: "#1f2937" },
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
    const INITIAL_TIMESTAMP_COUNT = 3;

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
            <div className="label">Vocal</div>
            <div className="value">
              {Array.isArray(artist) ? (
                <span>
                  {artist.map((name, i) => (
                    <span key={i}>
                      <span className={`pill ${getArtistClass(name)}`}>
                        {name}
                      </span>
                      {i < artist.length - 1 && (
                        <span className="collabSymbol"> × </span>
                      )}
                    </span>
                  ))}
                </span>
              ) : (
                artist && <span className="pill">{artist}</span>
              )}
            </div>
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
          font-weight: 700;
          opacity: 0.6;
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
