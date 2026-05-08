"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";

// Dynamically import the 3D scene to avoid SSR/WebGL crash
const GameScene3D = dynamic(
  () => import("@/components/three/GameScene3D").then((m) => m.GameScene3D),
  { ssr: false }
);

export default function DungeonPage() {
  return (
    <div className="relative w-full h-full">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05040A]">
            <div className="relative">
              {/* Animated loading rune */}
              <div className="w-20 h-20 border-2 border-[#00FFD4]/20 rounded-full animate-spin border-t-[#00FFD4]" />
              <div
                className="absolute inset-2 w-16 h-16 border border-[#7C3AED]/30 rounded-full animate-spin border-b-[#7C3AED]"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <p
              className="mt-8 text-[#00FFD4] text-sm tracking-[0.4em] uppercase opacity-60 animate-pulse"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Loading Dungeon…
            </p>
          </div>
        }
      >
        <GameScene3D />
      </Suspense>

      {/* Back link — shown briefly during load */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-[9999] text-[#00FFD4]/30 hover:text-[#00FFD4] text-[10px] tracking-widest font-['Cinzel'] uppercase transition-colors flex items-center gap-2"
      >
        ← Sanctum
      </Link>
    </div>
  );
}
