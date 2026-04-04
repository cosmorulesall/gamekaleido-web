import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/Hero';
import { WhatIs } from '@/components/marketing/WhatIs';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { PricingSection } from '@/components/marketing/PricingSection';
import { FooterZone } from '@/components/marketing/FooterZone';

export const metadata: Metadata = {
  title: 'Gamekaleido — Personalised Board Games',
  description: 'Create a one-of-a-kind board game personalised to your life, your people, your world. Your places, your memories, your game.',
  openGraph: {
    title: 'Gamekaleido — Personalised Board Games',
    description: 'Create a one-of-a-kind board game personalised to your life.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatIs />
      <HowItWorks />
      <PricingSection />
      <FooterZone />
    </>
  );
}
