"use client";

import { Inventory } from "@/components/Inventory";

export default function InventoryPage() {
  return (
    <div className="w-screen h-screen relative bg-[#020408]">
      <Inventory onClose={() => window.history.back()} />
    </div>
  );
}
