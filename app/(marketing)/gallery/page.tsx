import type { Metadata } from 'next';
import { PaperCard } from '@/components/marketing/PaperCard';
import { MarketingButton } from '@/components/marketing/MarketingButton';
import { GALLERY_ITEMS } from '@/lib/gallery-data';

export const metadata: Metadata = {
  title: 'Gallery — Gamekaleido',
  description: 'See examples of personalised board games created with Gamekaleido. Boards, cards, and digital companions.',
};

const typeLabels: Record<string, string> = {
  board: 'Board',
  cards: 'Cards',
  companion: 'Companion',
};

export default function GalleryPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-mk-display text-[clamp(2rem,5vw,3.5rem)] font-bold mk-letterpress text-center mb-4">
          Gallery
        </h1>
        <p className="font-mk-body text-center text-[var(--mk-text-muted)] mb-16 max-w-lg mx-auto">
          Every game is unique. Here are some examples of what Gamekaleido can create.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {GALLERY_ITEMS.map(item => (
            <PaperCard key={item.id} className="p-0 overflow-hidden">
              <div className="h-48 bg-[var(--mk-elevated)] flex items-center justify-center">
                <span className="font-mk-body text-sm text-[var(--mk-text-muted)] italic">
                  Preview coming soon
                </span>
              </div>
              <div className="p-6">
                <span className="inline-block px-2 py-0.5 text-xs font-mk-body font-medium text-[var(--mk-brass)] border border-[var(--mk-border-brass)] rounded mb-3">
                  {typeLabels[item.type]}
                </span>
                <h3 className="font-mk-display text-lg font-semibold text-[var(--mk-text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="font-mk-body text-sm text-[var(--mk-text-body)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </PaperCard>
          ))}
        </div>
        <div className="text-center">
          <MarketingButton href="/create/property-trading">
            Create Your Own
          </MarketingButton>
        </div>
      </div>
    </div>
  );
}
