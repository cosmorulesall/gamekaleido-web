export type Edition = 'digital' | 'physical';

interface EditionInfo {
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
}

export const PRICING: Record<Edition, EditionInfo> = {
  digital: {
    name: 'Digital Edition',
    description: 'Play instantly on any device with the digital companion.',
    price: 40,
    currency: 'GBP',
    features: [
      'Personalised game board',
      'Custom cards & questions',
      'Digital companion app',
      'Shareable game link',
      'Play on any device',
    ],
    cta: 'Create Digital Game',
    ctaHref: '/create/property-trading',
  },
  physical: {
    name: 'Physical Edition',
    description: 'A premium printed board game, delivered to your door.',
    price: 150,
    currency: 'GBP',
    features: [
      'Everything in Digital',
      'Premium printed board',
      'Custom card deck',
      'Game tokens & dice',
      'Gift-ready packaging',
      'Digital companion included',
    ],
    cta: 'Create Physical Game',
    ctaHref: '/create/property-trading',
    popular: true,
  },
};

export function formatPrice(edition: Edition): string {
  const info = PRICING[edition];
  return `£${info.price}`;
}
