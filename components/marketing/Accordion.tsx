'use client';

import { useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {items.map(item => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="mk-card p-0 overflow-hidden">
            <button
              id={`accordion-header-${item.id}`}
              className="w-full text-left px-6 py-4 flex items-center justify-between font-mk-body font-medium text-[var(--mk-text-primary)] hover:bg-[var(--mk-elevated)] transition-colors duration-150"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              onClick={() => toggle(item.id)}
            >
              <span>{item.question}</span>
              <svg
                className={`w-5 h-5 text-[var(--mk-brass)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
              hidden={!isOpen}
            >
              <div className="px-6 pb-4 text-[var(--mk-text-body)] font-mk-body leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
