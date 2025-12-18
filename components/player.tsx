import { JSX, useEffect, useMemo, useRef } from "react";

interface PlayerProps {
  videoId: string;
  start: number; 
}

export default function Player({
  videoId,
  start,
}: PlayerProps): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Keep your existing “don’t restart MV” behavior
  const iframeKey = useMemo(() => {
    return start > 0 ? `${videoId}-${start}` : videoId;
  }, [videoId, start]);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      enablejsapi: "1",
    });

    if (start > 0) params.set("start", String(start));

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, start]);

  return (
    <div className="player">
      <iframe
        ref={iframeRef}
        key={iframeKey}
        src={src}
        title="YouTube player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />

      <style jsx>{`
        .player {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }

        iframe {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
