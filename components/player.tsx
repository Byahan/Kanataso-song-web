"use client";

import { JSX, useMemo } from "react";

interface PlayerProps {
  videoId: string;
  start: number;
}

export default function Player({
  videoId,
  start,
}: PlayerProps): JSX.Element {
  const iframeKey = useMemo(() => {
    return start > 0 ? `${videoId}-${start}` : videoId;
  }, [videoId, start]);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });

    if (start > 0) {
      params.set("start", String(start));
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, start]);

  return (
    <div className="player">
      <iframe
        key={iframeKey}
        src={src}
        title="YouTube player"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
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
          border: 0;
        }
      `}</style>
    </div>
  );
}
