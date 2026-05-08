import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cinzelDeco = Cinzel_Decorative({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-cinzel-deco",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dungeon of Algorithms — Defeat Enemies. Solve Algorithms. Master the Dungeon.",
  description: "A cinematic 3D dungeon RPG where you defeat enemies by solving Data Structures & Algorithms challenges. Unlock powers, fight bosses, climb the leaderboard.",
  keywords: "dungeon, algorithms, DSA, game, coding, RPG, fantasy, cyberpunk",
  openGraph: {
    title: "Dungeon of Algorithms",
    description: "Defeat enemies. Solve algorithms. Master the dungeon.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${cinzelDeco.variable} ${firaCode.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#020408] text-slate-200 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
