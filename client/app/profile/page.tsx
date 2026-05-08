"use client";

import { PlayerProfile } from "@/components/PlayerProfile";

export default function ProfilePage() {
  return (
    <div className="w-screen h-screen relative">
      <PlayerProfile onClose={() => window.history.back()} />
    </div>
  );
}
