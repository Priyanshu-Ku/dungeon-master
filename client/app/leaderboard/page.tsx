"use client";

import { Leaderboard } from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="w-screen h-screen">
      <Leaderboard onClose={() => window.history.back()} />
    </div>
  );
}
