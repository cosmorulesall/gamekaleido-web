"use client";

const TABS = [
  { id: "board", label: "Board", icon: "grid" },
  { id: "cards", label: "Cards", icon: "cards" },
  { id: "dice", label: "Dice", icon: "dice" },
  { id: "tracker", label: "Tracker", icon: "users" },
  { id: "rules", label: "Rules", icon: "book" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

function TabIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "grid":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cards":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "dice":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case "users":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "book":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="flex justify-around border-t border-warm-border bg-obsidian/80 backdrop-blur-sm md:border-t-0 md:border-b md:border-warm-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 px-3 py-2.5 text-xs transition-colors ${
            activeTab === tab.id
              ? "text-amber border-t-2 border-amber md:border-t-0 md:border-b-2"
              : "text-warm-muted hover:text-warm-white/70 border-t-2 border-transparent md:border-t-0 md:border-b-2"
          }`}
        >
          <TabIcon icon={tab.icon} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
