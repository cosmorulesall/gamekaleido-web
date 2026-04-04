import { MarketingButton } from './MarketingButton';
import { BrassDivider } from './BrassDivider';

export function FooterZone() {
  return (
    <section className="py-24 px-6 bg-[var(--mk-bg-warm)] text-center">
      <div className="max-w-2xl mx-auto">
        <BrassDivider className="mb-12 max-w-xs mx-auto" />
        <h2 className="font-mk-display text-[clamp(1.8rem,4vw,3rem)] font-semibold mk-letterpress mb-6">
          Ready to Create Your Game?
        </h2>
        <p className="font-mk-body text-[var(--mk-text-body)] mb-10 leading-relaxed">
          It takes just a few minutes to tell us your story. We&apos;ll handle the rest.
        </p>
        <MarketingButton href="/create/property-trading" className="text-base px-10 py-4">
          Create Your Game
        </MarketingButton>
      </div>
    </section>
  );
}
