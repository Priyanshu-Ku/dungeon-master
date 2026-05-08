import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dungeon — Capsule: Dungeon of Algorithms",
  description: "Enter the dungeon. Defeat enemies by solving DSA challenges.",
};

export default function DungeonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#05040A]">
      {children}
    </div>
  );
}
