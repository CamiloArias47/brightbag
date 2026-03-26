"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface HeroMediaProps {
  imageSrc: string;
}

export function HeroMedia({ imageSrc }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <>
      <video
        ref={videoRef}
        src="/videos/brightbag_hero.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setVideoEnded(true)}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
          videoEnded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
      <Image
        src={imageSrc}
        alt="BrightBag reflectivo"
        fill
        className={`object-cover object-center transition-opacity duration-700 ${
          videoEnded ? "opacity-100" : "opacity-0"
        }`}
        priority
        sizes="100vw"
      />
    </>
  );
}
