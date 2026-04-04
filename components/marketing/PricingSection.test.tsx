import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PricingSection } from './PricingSection';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('PricingSection', () => {
  it('renders both pricing tiers', () => {
    render(<PricingSection />);
    expect(screen.getByText('Digital Edition')).toBeInTheDocument();
    expect(screen.getByText('Physical Edition')).toBeInTheDocument();
  });
  it('shows correct prices', () => {
    render(<PricingSection />);
    expect(screen.getByText('£40')).toBeInTheDocument();
    expect(screen.getByText('£150')).toBeInTheDocument();
  });
  it('renders CTA links for each tier', () => {
    render(<PricingSection />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });
});
