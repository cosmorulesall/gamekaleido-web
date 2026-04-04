'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;
    const overlay = overlayRef.current;
    const focusable = overlay.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    overlay.addEventListener('keydown', handleTab);
    return () => overlay.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Trigger — fixed top-right */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-lg backdrop-blur-sm bg-[var(--mk-bg-warm)]/60 border border-[var(--mk-border-brass)] hover:bg-[var(--mk-bg-warm)]/80 transition-colors duration-150"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M12 2L22 12L12 22L2 12Z" fill="none" stroke="var(--mk-brass)" strokeWidth="1.5" />
          <path d="M12 7L17 12L12 17L7 12Z" fill="var(--mk-brass)" opacity="0.3" />
          <circle cx="12" cy="12" r="1.5" fill="var(--mk-brass)" />
        </svg>
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeIn' }}
          >
            <motion.div
              className="absolute inset-0 bg-[var(--mk-text-primary)]/80 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.nav
              className="relative z-10 flex flex-col items-center gap-8 p-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <button
                onClick={close}
                className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center text-[var(--mk-bg)] hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="text-2xl font-mk-display font-semibold text-[var(--mk-bg)] hover:text-white transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/create/property-trading"
                onClick={close}
                className="mk-btn-primary mt-4 text-base px-10 py-4"
              >
                Create Your Game
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
