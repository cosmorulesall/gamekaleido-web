import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

const items = [
  { id: 'q1', question: 'What is this?', answer: 'A board game.' },
  { id: 'q2', question: 'How much?', answer: 'Forty pounds.' },
];

describe('Accordion', () => {
  it('renders all questions as buttons', () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole('button', { name: 'What is this?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How much?' })).toBeInTheDocument();
  });
  it('answers are hidden by default', () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText('A board game.')).not.toBeVisible();
    expect(screen.queryByText('Forty pounds.')).not.toBeVisible();
  });
  it('clicking a question reveals its answer', async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole('button', { name: 'What is this?' }));
    expect(screen.getByText('A board game.')).toBeVisible();
  });
  it('clicking an open question hides its answer', async () => {
    render(<Accordion items={items} />);
    const btn = screen.getByRole('button', { name: 'What is this?' });
    await userEvent.click(btn);
    expect(screen.getByText('A board game.')).toBeVisible();
    await userEvent.click(btn);
    expect(screen.queryByText('A board game.')).not.toBeVisible();
  });
  it('sets aria-expanded correctly', async () => {
    render(<Accordion items={items} />);
    const btn = screen.getByRole('button', { name: 'What is this?' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
  it('button has aria-controls matching panel id', () => {
    render(<Accordion items={items} />);
    const btn = screen.getByRole('button', { name: 'What is this?' });
    expect(btn).toHaveAttribute('aria-controls', 'accordion-panel-q1');
  });
  it('panel has role=region and aria-labelledby', async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole('button', { name: 'What is this?' }));
    const panel = document.getElementById('accordion-panel-q1');
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', 'accordion-header-q1');
  });
});
