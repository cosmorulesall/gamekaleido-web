import type { Metadata } from 'next';
import { PaperCard } from '@/components/marketing/PaperCard';
import { MarketingButton } from '@/components/marketing/MarketingButton';
import { BrassDivider } from '@/components/marketing/BrassDivider';

export const metadata: Metadata = {
  title: 'Contact — Gamekaleido',
  description: 'Get in touch with Gamekaleido. Questions, support, or just to say hello.',
};

export default function ContactPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-mk-display text-[clamp(2rem,5vw,3.5rem)] font-bold mk-letterpress mb-4">
          Get in Touch
        </h1>
        <p className="font-mk-body text-[var(--mk-text-body)] mb-12 leading-relaxed">
          Got a question? Check our FAQ first — it covers most common queries.
          If you need something else, drop us an email.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <MarketingButton href="/faq" variant="ghost">
            Read the FAQ
          </MarketingButton>
          <MarketingButton href="mailto:hello@gamekaleido.com">
            Email Us
          </MarketingButton>
        </div>
        <BrassDivider className="mb-12 max-w-xs mx-auto" />
        <PaperCard hover={false} className="p-8 text-left">
          <h2 className="font-mk-display text-lg font-semibold text-[var(--mk-text-primary)] mb-3">
            Response Times
          </h2>
          <p className="font-mk-body text-sm text-[var(--mk-text-body)] leading-relaxed">
            We aim to reply within 24 hours on weekdays. For order-related queries,
            please include your order number.
          </p>
        </PaperCard>
      </div>
    </div>
  );
}
