import type { Metadata } from 'next';
import { Accordion } from '@/components/marketing/Accordion';
import { BrassDivider } from '@/components/marketing/BrassDivider';
import { FAQ_DATA } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'FAQ — Gamekaleido',
  description: 'Frequently asked questions about Gamekaleido personalised board games. Ordering, pricing, shipping, and more.',
};

export default function FaqPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-mk-display text-[clamp(2rem,5vw,3.5rem)] font-bold mk-letterpress text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="font-mk-body text-center text-[var(--mk-text-muted)] mb-16">
          Everything you need to know about creating your personalised board game.
        </p>
        {FAQ_DATA.map((category, index) => (
          <div key={category.name} className="mb-12">
            <h2 className="font-mk-display text-xl font-semibold text-[var(--mk-text-primary)] mb-4">
              {category.name}
            </h2>
            <Accordion items={category.items} />
            {index < FAQ_DATA.length - 1 && <BrassDivider className="mt-12" />}
          </div>
        ))}
      </div>
    </div>
  );
}
