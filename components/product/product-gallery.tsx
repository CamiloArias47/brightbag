"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: Props) {
  const safe = images.length
    ? images
    : ["/images/Gemini_Generated_Image_e0uhy0e0uhy0e0uh.png"];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface-3",
          "flash-hover ring-1 ring-white/5"
        )}
      >
        <Image
          src={safe[active] ?? safe[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {safe.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safe.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-all",
                i === active ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
