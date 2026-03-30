import { Hero } from '@/components/marketing/Hero';
import { WhatIs } from '@/components/marketing/WhatIs';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { PricingSection } from '@/components/marketing/PricingSection';
import { FooterZone } from '@/components/marketing/FooterZone';

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
