import { PaperCard } from './PaperCard';

const steps = [
  {
    number: '01',
    title: 'Tell Us Your Story',
    description: 'Answer questions about your favourite people, places, and memories.',
  },
  {
    number: '02',
    title: 'We Craft Your Game',
    description: 'AI generates your unique game. A human reviews every detail.',
  },
  {
    number: '03',
    title: 'Play Your Way',
    description: 'Enjoy digitally with friends or receive a premium physical box.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[var(--mk-bg-warm)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-mk-display text-[clamp(1.8rem,4vw,3rem)] font-semibold mk-letterpress text-center mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(step => (
            <PaperCard key={step.number} className="p-8 text-center">
              <span className="block font-mk-display text-5xl font-bold text-[var(--mk-brass)] opacity-30 mb-4">
                {step.number}
              </span>
              <h3 className="font-mk-display text-xl font-semibold text-[var(--mk-text-primary)] mb-3">
                {step.title}
              </h3>
              <p className="font-mk-body text-[var(--mk-text-body)] leading-relaxed">
                {step.description}
              </p>
            </PaperCard>
          ))}
        </div>
      </div>
    </section>
  );
}
