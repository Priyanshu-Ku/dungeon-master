"use client";

import { VictoryDefeatScreen } from "@/components/VictoryDefeatScreen";

export default function DefeatPage() {
  return (
    <div className="w-screen h-screen relative bg-[#020408]">
      <VictoryDefeatScreen 
        result="defeat" 
        onRetry={() => window.history.back()} 
        onRetreat={() => window.history.back()} 
      />
    </div>
  );
}
