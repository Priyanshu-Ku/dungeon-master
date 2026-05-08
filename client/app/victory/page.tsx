"use client";

import { VictoryDefeatScreen } from "@/components/VictoryDefeatScreen";

export default function VictoryPage() {
  return (
    <div className="w-screen h-screen relative bg-[#020408]">
      <VictoryDefeatScreen 
        result="victory" 
        onRetry={() => window.history.back()} 
        onRetreat={() => window.history.back()} 
      />
    </div>
  );
}
