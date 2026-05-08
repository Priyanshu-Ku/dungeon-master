"use client";

import { WorldMap } from "@/components/WorldMap";
import { useState } from "react";

export default function MapPage() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="w-screen h-screen relative bg-[#020408]">
      <WorldMap isOpen={isOpen} onClose={() => window.history.back()} />
    </div>
  );
}
