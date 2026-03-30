import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaperCard } from './PaperCard';

describe('PaperCard', () => {
  it('renders children', () => {
    render(<PaperCard>Hello</PaperCard>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  it('applies mk-card class', () => {
    const { container } = render(<PaperCard>Content</PaperCard>);
    expect(container.firstChild).toHaveClass('mk-card');
  });
  it('applies hover class by default', () => {
    const { container } = render(<PaperCard>Content</PaperCard>);
    expect(container.firstChild).toHaveClass('mk-card-hover');
  });
  it('omits hover class when hover=false', () => {
    const { container } = render(<PaperCard hover={false}>Content</PaperCard>);
    expect(container.firstChild).not.toHaveClass('mk-card-hover');
  });
  it('merges custom className', () => {
    const { container } = render(<PaperCard className="p-8">Content</PaperCard>);
    expect(container.firstChild).toHaveClass('mk-card');
    expect(container.firstChild).toHaveClass('p-8');
  });
});
