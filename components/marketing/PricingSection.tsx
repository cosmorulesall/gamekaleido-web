import { PaperCard } from './PaperCard';
import { MarketingButton } from './MarketingButton';
import { BrassDivider } from './BrassDivider';
import { PRICING, formatPrice, type Edition } from '@/lib/pricing';

const editions: Edition[] = ['digital', 'physical'];

export function PricingSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-mk-display text-[clamp(1.8rem,4vw,3rem)] font-semibold mk-letterpress text-center mb-16">
          Choose Your Edition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {editions.map(edition => {
            const info = PRICING[edition];
            return (
              <PaperCard key={edition} className="p-8 flex flex-col relative">
                {info.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-mk-body font-medium tracking-wide bg-[var(--mk-brass)] text-[#F5F0EB] rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-mk-display text-2xl font-semibold text-[var(--mk-text-primary)] mb-2">
                  {info.name}
                </h3>
                <p className="font-mk-body text-sm text-[var(--mk-text-muted)] mb-6">
                  {info.description}
                </p>
                <p className="font-mk-display text-4xl font-bold text-[var(--mk-brass)] mb-6">
                  {formatPrice(edition)}
                </p>
                <BrassDivider className="mb-6" />
                <ul className="space-y-3 mb-8 flex-1">
                  {info.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 font-mk-body text-sm text-[var(--mk-text-body)]">
                      <svg className="w-4 h-4 mt-0.5 text-[var(--mk-brass)] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <MarketingButton
                  href={info.ctaHref}
                  variant={info.popular ? 'primary' : 'ghost'}
                  className="w-full"
                >
                  {info.cta}
                </MarketingButton>
              </PaperCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
