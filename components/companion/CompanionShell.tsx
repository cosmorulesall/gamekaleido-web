"use client";

import { useState } from "react";
import type { GameInstance } from "@/lib/load-instance";
import TabBar, { type TabId } from "./TabBar";
import BoardPanel from "./panels/BoardPanel";
import CardsPanel from "./panels/CardsPanel";
import DicePanel from "./panels/DicePanel";
import TrackerPanel from "./panels/TrackerPanel";
import RulesPanel from "./panels/RulesPanel";

interface CompanionShellProps {
  instance: GameInstance;
}

export default function CompanionShell({ instance }: CompanionShellProps) {
  const [activeTab, setActiveTab] = useState<TabId>("board");

  return (
    <div className="min-h-dvh flex flex-col bg-[#0D0B10]">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 text-center">
        <h1 className="font-display text-display-md text-warm-white">
          {instance.identity.game_name}
        </h1>
        <p className="text-warm-muted text-sm mt-1">
          {instance.identity.tagline}
        </p>
      </header>

      {/* Desktop tab bar */}
      <div className="hidden md:block px-4 max-w-2xl mx-auto w-full">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full overflow-y-auto pb-20 md:pb-4">
        <div className="glass-panel p-6">
          {activeTab === "board" && <BoardPanel instance={instance} />}
          {activeTab === "cards" && <CardsPanel instance={instance} />}
          {activeTab === "dice" && <DicePanel instance={instance} />}
          {activeTab === "tracker" && <TrackerPanel instance={instance} />}
          {activeTab === "rules" && <RulesPanel instance={instance} />}
        </div>
      </main>

      {/* Mobile tab bar — fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
