import { BrassDivider } from './BrassDivider';

export function WhatIs() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <BrassDivider className="mb-12 max-w-xs mx-auto" />
        <h2 className="font-mk-display text-[clamp(1.8rem,4vw,3rem)] font-semibold mk-letterpress mb-6">
          What Is Gamekaleido?
        </h2>
        <p className="font-mk-body text-lg text-[var(--mk-text-body)] leading-relaxed mb-4">
          Gamekaleido creates personalised board games built around your life — your favourite
          places, your people, your inside jokes. Every game is unique, crafted with AI
          and finished by hand.
        </p>
        <p className="font-mk-body text-base text-[var(--mk-text-muted)] leading-relaxed">
          Think of it as a kaleidoscope: infinite possibilities, but the pattern it makes
          is entirely yours.
        </p>
        <BrassDivider className="mt-12 max-w-xs mx-auto" />
      </div>
    </section>
  );
}
