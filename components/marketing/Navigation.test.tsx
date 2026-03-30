import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from './Navigation';

vi.mock('next/link', () => ({
  default: ({ children, href, className, onClick }: { children: React.ReactNode; href: string; className?: string; onClick?: () => void }) => (
    <a href={href} className={className} onClick={onClick}>{children}</a>
  ),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
}));

describe('Navigation', () => {
  it('renders trigger button', () => {
    render(<Navigation />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
  it('overlay is hidden by default', () => {
    render(<Navigation />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('clicking trigger opens overlay', async () => {
    render(<Navigation />);
    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('overlay contains navigation links', async () => {
    render(<Navigation />);
    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });
  it('overlay contains primary CTA', async () => {
    render(<Navigation />);
    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('link', { name: /create your game/i })).toBeInTheDocument();
  });
  it('clicking close button closes overlay', async () => {
    render(<Navigation />);
    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('pressing Escape closes overlay', async () => {
    render(<Navigation />);
    await userEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
