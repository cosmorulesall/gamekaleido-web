import type { Metadata } from 'next';
import { BrassDivider } from '@/components/marketing/BrassDivider';
import { MarketingButton } from '@/components/marketing/MarketingButton';

export const metadata: Metadata = {
  title: 'About — Gamekaleido',
  description: 'The story behind Gamekaleido — one person, one vision, AI-powered craft for personalised board games.',
};

export default function AboutPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-mk-display text-[clamp(2rem,5vw,3.5rem)] font-bold mk-letterpress text-center mb-6">
          About Gamekaleido
        </h1>
        <BrassDivider className="mb-12 max-w-xs mx-auto" />
        <div className="space-y-6 font-mk-body text-[var(--mk-text-body)] leading-relaxed">
          <p>
            Gamekaleido started with a simple idea: what if a board game could be about
            <em> your</em> life? Not a generic template with your name stamped on it, but a
            game where every space, every card, every question is drawn from your world.
          </p>
          <p>
            The name comes from a kaleidoscope — an instrument that takes ordinary
            fragments and arranges them into something extraordinary. That is what
            Gamekaleido does with your stories, places, and people.
          </p>
          <p>
            Built by one person with a vision and powered by AI, every game is generated
            uniquely and reviewed carefully. No two games are alike, because no two lives
            are alike.
          </p>
        </div>
        <div className="flex justify-center my-16">
          <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className="opacity-30">
            <path d="M24 4L44 24L24 44L4 24Z" fill="none" stroke="var(--mk-brass)" strokeWidth="1" />
            <path d="M24 12L36 24L24 36L12 24Z" fill="none" stroke="var(--mk-brass)" strokeWidth="0.75" />
            <path d="M24 18L30 24L24 30L18 24Z" fill="var(--mk-brass)" opacity="0.2" />
            <circle cx="24" cy="24" r="2" fill="var(--mk-brass)" opacity="0.4" />
          </svg>
        </div>
        <div className="text-center">
          <MarketingButton href="/create/property-trading">
            Create Your Game
          </MarketingButton>
        </div>
      </div>
    </div>
  );
}
