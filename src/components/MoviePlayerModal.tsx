"use client";

import ReactPlayer from "react-player";
import { useState } from "react";

interface MoviePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function MoviePlayerModal({
  isOpen,
  onClose,
  url,
  title,
}: MoviePlayerModalProps) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 cursor-pointer w-10 h-10 rounded-full hover:bg-gray-500 active:scale-90 transition-transform"
            aria-label="Close player"
          >
            ✕
          </button>
        </div>
        <div className="relative aspect-video">
          {!url || error ? (
            <p className="text-red-400 text-center p-4">
              {error ||
                "No video found. This may be a trailer or unavailable in your region. Try Tubi."}
            </p>
          ) : (
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              controls
              className="absolute top-0 left-0"
              onError={() =>
                setError(
                  "Unable to play this video. It may be unavailable in your region."
                )
              }
              config={{
                youtube: { playerVars: { showinfo: 0, modestbranding: 1 } },
              }}
            />
          )}
        </div>
        <div className="p-4">
          <p className="text-gray-400 text-sm">
            This video is sourced from YouTube and may include ads, be a
            trailer, or be region-restricted.
          </p>
        </div>
      </div>
    </div>
  );
}
