import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarketingButton } from './MarketingButton';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

describe('MarketingButton', () => {
  it('renders primary variant by default', () => {
    render(<MarketingButton>Click me</MarketingButton>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toHaveClass('mk-btn-primary');
  });
  it('renders ghost variant', () => {
    render(<MarketingButton variant="ghost">Ghost</MarketingButton>);
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass('mk-btn-ghost');
  });
  it('renders subtle variant', () => {
    render(<MarketingButton variant="subtle">Subtle</MarketingButton>);
    expect(screen.getByRole('button', { name: 'Subtle' })).toHaveClass('mk-btn-subtle');
  });
  it('renders as link when href provided', () => {
    render(<MarketingButton href="/create">Start</MarketingButton>);
    const link = screen.getByRole('link', { name: 'Start' });
    expect(link).toHaveAttribute('href', '/create');
    expect(link).toHaveClass('mk-btn-primary');
  });
  it('renders as button when disabled even with href', () => {
    render(<MarketingButton href="/create" disabled>Start</MarketingButton>);
    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(<MarketingButton onClick={onClick}>Click</MarketingButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
