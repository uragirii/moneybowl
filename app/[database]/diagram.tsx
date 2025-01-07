"use client";
import { useState } from "react";

interface DiagramProps {
  src: string;
  fallbackSrc: string;
}

export function Diagram({ src, fallbackSrc }: DiagramProps) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <div className="relative">
          <img className="w-full motion-safe:animate-pulse h-[500px]" src={fallbackSrc} />
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Loading interactive diagram...
          </p>
        </div>
      )}
      <iframe
        className="w-full"
        hidden={loading}
        height="500"
        src={src}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </>
  );
}
