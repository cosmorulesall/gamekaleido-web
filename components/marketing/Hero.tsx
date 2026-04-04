import { KaleidoPlaceholder } from './KaleidoPlaceholder';
import { MarketingButton } from './MarketingButton';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <KaleidoPlaceholder />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="font-mk-display text-[clamp(2.5rem,7vw,5rem)] font-bold mk-letterpress leading-[1.05] tracking-tight mb-6">
          Your World. Your Game.
        </h1>
        <p className="font-mk-body text-lg text-[var(--mk-text-body)] mb-10 max-w-lg mx-auto leading-relaxed">
          Create a one-of-a-kind board game personalised to your life, your people, your places.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <MarketingButton href="/create/property-trading">
            Create Your Game
          </MarketingButton>
          <MarketingButton variant="ghost" href="#how-it-works">
            See How It Works
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}
